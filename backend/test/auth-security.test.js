import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';

const secret = 'isolated-security-tests-only-not-a-production-secret';
let currentUser;
await mock.module('../src/config/index.js', { defaultExport: { jwt: { secret, issuer: 'sysmp-api', expiresIn: '1h' } } });
await mock.module('../src/config/logger.js', { defaultExport: { info() {}, warn() {}, error() {} } });
await mock.module('../src/repositories/repository.user.js', { defaultExport: {
  getUserById: async () => currentUser,
  listByEmail: async () => currentUser
} });
const { ValidateToken, isAdmin } = await import('../src/middleware/auth.js');
const { default: users } = await import('../src/services/service.user.js');
const sign = (payload, options = {}) => jwt.sign(payload, secret, { issuer: 'sysmp-api', expiresIn: '1h', ...options });

async function validate(token, bearer = 'Bearer') {
  const req = { headers: token ? { authorization: `${bearer} ${token}` } : {} };
  let status = 200, proceeded = false;
  const res = { status(n) { status = n; return this; }, json() { return this; } };
  await ValidateToken(req, res, () => { proceeded = true; });
  return { req, res, get status() { return status; }, proceeded };
}

test('authentication and live authorization', async t => {
  currentUser = { id_user: 1, role: 'user', status: 'active' };
  for (const [name, token] of [
    ['missing', undefined], ['malformed', 'bad-token'],
    ['expired', sign({ id: 1 }, { expiresIn: -1 })],
    ['wrong issuer', sign({ id: 1 }, { issuer: 'another-api' })],
    ['wrong algorithm', sign({ id: 1 }, { algorithm: 'HS384' })],
    ['invalid identity', sign({ role: 'admin' })]
  ]) await t.test(name, async () => assert.equal((await validate(token)).status, 401));
  await t.test('active user passes', async () => assert.equal((await validate(sign({ id: 1, role: 'user' }))).proceeded, true));
  await t.test('demoted admin loses admin permission immediately', async () => {
    const r = await validate(sign({ id: 1, role: 'admin' }));
    assert.equal(r.req.user.role, 'user');
    let allowed = false; isAdmin(r.req, r.res, () => { allowed = true; });
    assert.equal(allowed, false); assert.equal(r.status, 403);
  });
  await t.test('current admin passes', async () => {
    currentUser.role = 'admin'; const r = await validate(sign({ id: 1, role: 'user' }));
    let allowed = false; isAdmin(r.req, r.res, () => { allowed = true; }); assert.equal(allowed, true);
  });
  await t.test('disabled user loses access', async () => {
    currentUser.status = 'inactive'; assert.equal((await validate(sign({ id: 1 }))).status, 401);
    assert.equal(await users.login('disabled@example.test', 'any-password'), null);
  });
  await t.test('deleted user loses access', async () => {
    currentUser = undefined; assert.equal((await validate(sign({ id: 1 }))).status, 401);
  });
});

test('WebSocket requires an authenticated active account', async t => {
  const { initializeSocket } = await import('../src/socket.js');
  const require = createRequire(new URL('../../frontend/package.json', import.meta.url));
  const { io: connect } = require('socket.io-client');
  const server = createServer();
  const io = initializeSocket(server);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}`;
  async function attempt(value) {
    const client = connect(url, { auth: { token: value }, reconnection: false, forceNew: true, timeout: 2000 });
    t.after(() => client.disconnect());
    return new Promise((resolve, reject) => {
      client.once('connect', () => resolve({ connected: true, client }));
      client.once('connect_error', e => e.message === 'Autenticação necessária' ? resolve({ connected: false, client }) : reject(e));
    });
  }
  t.after(() => new Promise(resolve => io.close(resolve)));
  currentUser = { id_user: 1, role: 'user', status: 'active' };
  assert.equal((await attempt(undefined)).connected, false);
  assert.equal((await attempt('invalid-token')).connected, false);
  assert.equal((await attempt(sign({ id: 1 }, { expiresIn: -1 }))).connected, false);
  const valid = await attempt(sign({ id: 1 })); assert.equal(valid.connected, true);
  const event = new Promise(resolve => valid.client.once('data-changed', resolve));
  io.emit('data-changed', { type: 'extra', action: 'update' });
  assert.deepEqual(await event, { type: 'extra', action: 'update' });
  currentUser.status = 'inactive'; assert.equal((await attempt(sign({ id: 1 }))).connected, false);
});
