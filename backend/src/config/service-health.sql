-- Only the harmless monitoring row is exposed. Existing tables are untouched.
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '15s';

DO $migration$
BEGIN
  IF to_regclass('public.service_health') IS NULL THEN
    CREATE TABLE public.service_health (
      id smallint PRIMARY KEY CHECK (id = 1),
      status text NOT NULL CHECK (status = 'ok'),
      project_ref text NOT NULL CHECK (project_ref = 'qcriykfyryaubdjdcgeo')
    );
    COMMENT ON TABLE public.service_health IS 'supabase-monitoring-v1: public sentinel; no personal data';
  ELSIF obj_description('public.service_health'::regclass, 'pg_class') IS DISTINCT FROM
    'supabase-monitoring-v1: public sentinel; no personal data' THEN
    RAISE EXCEPTION 'Existing service_health is not the managed monitoring table';
  END IF;
END
$migration$;

INSERT INTO public.service_health (id, status, project_ref)
VALUES (1, 'ok', 'qcriykfyryaubdjdcgeo') ON CONFLICT (id) DO NOTHING;

DO $verify$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.service_health WHERE id = 1 AND status = 'ok' AND project_ref = 'qcriykfyryaubdjdcgeo') THEN
    RAISE EXCEPTION 'Monitoring row does not match this project';
  END IF;
END
$verify$;

ALTER TABLE public.service_health ENABLE ROW LEVEL SECURITY;
REVOKE ALL PRIVILEGES ON TABLE public.service_health FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.service_health TO anon;

DROP POLICY IF EXISTS "Anon can read monitoring row" ON public.service_health;
CREATE POLICY "Anon can read monitoring row" ON public.service_health
  FOR SELECT TO anon USING (id = 1);

NOTIFY pgrst, 'reload schema';
COMMIT;
