import { test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';

const workingDb = { query: async () => ({ rows: [] }) };
const brokenDb = { query: async () => { throw new Error('connection refused'); } };
const makeApp = (db) => createApp({ db, internalToken: 'test-token', log: false });

test('GET /health returns ok when the database answers', async () => {
  const res = await request(makeApp(workingDb)).get('/health');
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, { status: 'ok' });
});

test('GET /health returns 503 when the database is down', async () => {
  const res = await request(makeApp(brokenDb)).get('/health');
  assert.equal(res.status, 503);
  assert.ok(res.body.error);
});

test('internal routes reject requests without a valid token', async () => {
  const app = makeApp(workingDb);
  const missing = await request(app).get('/internal/problems/1/testcases');
  const wrong = await request(app).get('/internal/problems/1/testcases').set('X-Internal-Token', 'nope');
  assert.equal(missing.status, 401);
  assert.equal(wrong.status, 401);
  assert.deepEqual(missing.body, { error: 'Unauthorized' });
});
