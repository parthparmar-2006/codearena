import { test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';

const db = { query: async () => ({ rows: [] }) };
const redis = { ping: async () => 'PONG', lpush: async () => 1 };
const makeApp = () => createApp({ db, redis, internalToken: 'test-token', log: false });

test('GET /health returns ok when the database and Redis answer', async () => {
  const res = await request(makeApp()).get('/health');
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, { status: 'ok' });
});

test('POST /api/submissions rejects invalid input', async () => {
  const app = makeApp();
  const badLanguage = await request(app)
    .post('/api/submissions')
    .send({ problemId: 1, language: 'python', code: 'print(1)' });
  const tooLarge = await request(app)
    .post('/api/submissions')
    .send({ problemId: 1, language: 'cpp', code: 'x'.repeat(64 * 1024 + 1) });
  assert.equal(badLanguage.status, 400);
  assert.equal(badLanguage.body.error, 'language must be "cpp"');
  assert.equal(tooLarge.status, 400);
  assert.equal(tooLarge.body.error, 'code must be at most 64 KB');
});

test('internal routes reject requests without a valid token', async () => {
  const id = '00000000-0000-4000-8000-000000000000';
  const res = await request(makeApp()).patch(`/internal/submissions/${id}`).send({ status: 'DONE' });
  assert.equal(res.status, 401);
  assert.deepEqual(res.body, { error: 'Unauthorized' });
});
