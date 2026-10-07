"""Exercise transport retries and payload validation without real API credentials."""
import base64
import json
import os
from pathlib import Path
import subprocess
import tempfile
import unittest

SCRIPT = Path(__file__).with_name('supabase-ping.sh')
REF = 'qcriykfyryaubdjdcgeo'
ROW = [{'id': 1, 'status': 'ok', 'project_ref': REF}]


def key(role='anon', ref=REF):
    payload = base64.urlsafe_b64encode(json.dumps({'role': role, 'ref': ref}).encode()).decode().rstrip('=')
    return 'eyJhbGciOiJIUzI1NiJ9.' + payload + '.testsignature'


class PingTests(unittest.TestCase):
    def run_ping(self, responses, api_key=None, table='service_health', url=None, ref=REF):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / 'scenario.json').write_text(json.dumps(responses))
            (root / 'curl').write_text('''#!/usr/bin/env python3
import json, os, sys
from pathlib import Path
p=Path(os.environ['FIXTURE_DIR'])
counter=p/'attempts'
n=int(counter.read_text()) if counter.exists() else 0
counter.write_text(str(n+1))
args=sys.argv[1:]
assert args[args.index('--connect-timeout')+1]=='10'
assert args[args.index('--max-time')+1]=='30'
if os.environ['SUPABASE_MONITOR_TABLE']=='service_health':
    assert '/rest/v1/service_health?' in args[-1] and 'id=eq.1' in args[-1]
else:
    assert '/rest/v1/categories?select=id&limit=1' in args[-1]
scenarios=json.loads((p/'scenario.json').read_text())
s=scenarios[min(n,len(scenarios)-1)]
body=s.get('body', [])
Path(args[args.index('--output')+1]).write_text(body if isinstance(body,str) else json.dumps(body))
print(s.get('http','200'),end='')
sys.exit(s.get('exit',0))
''')
            (root / 'sleep').write_text('#!/bin/sh\nprintf "%s\\n" "$1" >> "$FIXTURE_DIR/delays"\n')
            for command in ['curl', 'sleep']:
                (root / command).chmod(0o700)
            env = dict(os.environ, PATH=tmp + os.pathsep + os.environ['PATH'], FIXTURE_DIR=tmp,
                       SUPABASE_PROJECT_REF=REF, SUPABASE_ANON_KEY=api_key or key(), SUPABASE_MONITOR_TABLE=table)
            env.pop('SUPABASE_URL', None)
            env.pop('SUPABASE_API_KEY', None)
            if url is not None:
                env['SUPABASE_URL'] = url
            if ref is None:
                env.pop('SUPABASE_PROJECT_REF', None)
            run = subprocess.run(['bash', str(SCRIPT)], env=env, capture_output=True, text=True, timeout=10)
            attempts = int((root / 'attempts').read_text()) if (root / 'attempts').exists() else 0
            delays = (root / 'delays').read_text().splitlines() if (root / 'delays').exists() else []
            self.assertNotIn(env['SUPABASE_ANON_KEY'], run.stdout + run.stderr)
            return run.returncode, attempts, delays

    def test_valid_row(self):
        self.assertEqual(self.run_ping([{'body': ROW}]), (0, 1, []))

    def test_transient_errors_recover(self):
        for error in [{'exit': 6, 'http': '000'}, {'exit': 28, 'http': '000'}, {'http': '503'}]:
            with self.subTest(error=error):
                self.assertEqual(self.run_ping([error, {'body': ROW}]), (0, 2, ['10']))

    def test_invalid_200_responses_fail(self):
        for body in [[], 'not JSON', [{'count': 0}], ROW * 2,
                     [{'id': 1, 'status': 'ok', 'project_ref': 'zgnrrhmipzyfoykjiwfg'}],
                     [{'id': 1, 'status': 'bad', 'project_ref': REF}],
                     [{'id': 1, 'status': 'ok', 'project_ref': REF, 'extra': 'unexpected'}]]:
            with self.subTest(body=body):
                self.assertEqual(self.run_ping([{'body': body}]), (1, 3, ['10', '20']))

    def test_valid_body_with_error_status_fails(self):
        self.assertEqual(self.run_ping([{'http': '403', 'body': ROW}]), (1, 3, ['10', '20']))

    def test_privileged_and_wrong_project_keys_are_rejected(self):
        for api_key in [key('service_role'), key(ref='zgnrrhmipzyfoykjiwfg')]:
            self.assertEqual(self.run_ping([{'body': ROW}], api_key), (1, 0, []))

    def test_category_row_requires_nonempty_id(self):
        self.assertEqual(self.run_ping([{'body': [{'id': 'public-category'}]}], table='categories'), (0, 1, []))
        for body in [[], [{'id': ''}], [{'id': 1}], [{'id': 'x', 'private': 'unexpected'}]]:
            self.assertEqual(self.run_ping([{'body': body}], table='categories'), (1, 3, ['10', '20']))

    def test_url_secret_resolves_and_checks_project(self):
        valid = 'https://' + REF + '.supabase.co'
        self.assertEqual(self.run_ping([{'body': ROW}], url=valid, ref=None), (0, 1, []))
        for invalid in ['https://supabase.com/dashboard/project/' + REF, 'https://zgnrrhmipzyfoykjiwfg.supabase.co']:
            self.assertEqual(self.run_ping([{'body': ROW}], url=invalid), (1, 0, []))

    def test_publishable_key_and_existing_category_job_key(self):
        self.assertEqual(self.run_ping([{'body': ROW}], api_key='sb_publishable_test'), (0, 1, []))
        self.assertEqual(self.run_ping([{'body': ROW}], api_key='sb_secret_test'), (1, 0, []))
        self.assertEqual(self.run_ping([{'body': [{'id': 'category'}]}], api_key=key('service_role'), table='categories'), (0, 1, []))


if __name__ == '__main__':
    unittest.main()
