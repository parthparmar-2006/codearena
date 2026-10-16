import { test } from 'node:test';
import assert from 'node:assert/strict';
import { testVerdict } from '../src/verdict.js';

const LIMIT_MS = 1000;
const run = (overrides) => ({
  exitCode: 0,
  signal: null,
  stdout: '42\n',
  timedOut: false,
  truncated: false,
  timeMs: 10,
  ...overrides,
});

test('correct output within the limit is AC', () => {
  assert.equal(testVerdict(run(), '42', LIMIT_MS), 'AC');
});

test('wrong output is WA', () => {
  assert.equal(testVerdict(run({ stdout: '41\n' }), '42', LIMIT_MS), 'WA');
});

test('output over the size cap is WA', () => {
  assert.equal(testVerdict(run({ truncated: true, signal: 'SIGKILL', exitCode: null }), '42', LIMIT_MS), 'WA');
});

test('wall clock kill, CPU limit or slow finish is TLE', () => {
  assert.equal(testVerdict(run({ timedOut: true, signal: 'SIGKILL', exitCode: null }), '42', LIMIT_MS), 'TLE');
  assert.equal(testVerdict(run({ signal: 'SIGXCPU', exitCode: null }), '42', LIMIT_MS), 'TLE');
  assert.equal(testVerdict(run({ timeMs: 1200 }), '42', LIMIT_MS), 'TLE');
});

test('non-zero exit or a crash signal is RE', () => {
  assert.equal(testVerdict(run({ exitCode: 1 }), '42', LIMIT_MS), 'RE');
  assert.equal(testVerdict(run({ signal: 'SIGSEGV', exitCode: null }), '42', LIMIT_MS), 'RE');
  assert.equal(testVerdict(run({ signal: 'SIGFPE', exitCode: null, stdout: '42' }), '42', LIMIT_MS), 'RE');
});
