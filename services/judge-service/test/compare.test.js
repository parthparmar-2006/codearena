import { test } from 'node:test';
import assert from 'node:assert/strict';
import { outputsMatch } from '../src/compare.js';

test('identical output matches', () => {
  assert.ok(outputsMatch('1\n-1\n4', '1\n-1\n4'));
});

test('trailing spaces, trailing newlines and CRLF are ignored', () => {
  assert.ok(outputsMatch('1  \r\n-1\t\r\n4\n\n\n', '1\n-1\n4'));
});

test('different values or leading whitespace do not match', () => {
  assert.equal(outputsMatch('5', '6'), false);
  assert.equal(outputsMatch(' 5', '5'), false);
  assert.equal(outputsMatch('1\n\n2', '1\n2'), false);
});
