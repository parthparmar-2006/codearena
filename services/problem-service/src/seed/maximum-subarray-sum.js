import { starterCode, createRandom } from './helpers.js';

function kadane(values) {
  let best = values[0];
  let current = 0;
  for (const v of values) {
    current = Math.max(v, current + v);
    best = Math.max(best, current);
  }
  return best;
}

function largeTest() {
  const random = createRandom(42);
  const values = Array.from({ length: 100000 }, () => random(-1000000000, 1000000000));
  return { input: `${values.length}\n${values.join(' ')}\n`, output: String(kadane(values)) };
}

export default {
  slug: 'maximum-subarray-sum',
  title: 'Maximum Subarray Sum',
  difficulty: 'medium',
  timeLimitMs: 1000,
  memoryLimitMb: 256,
  statement: `Given an array of **n** integers, find the largest possible sum of a non-empty contiguous subarray.

### Input
- The first line has one integer **n**.
- The second line has **n** integers.

### Output
Print one integer, the maximum subarray sum.

### Constraints
- 1 ≤ n ≤ 10⁵
- -10⁹ ≤ every value ≤ 10⁹
- The answer may not fit in a 32-bit integer.
`,
  starterCode: starterCode('Read n and the array, then print the maximum subarray sum'),
  tests: [
    { input: '9\n-2 1 -3 4 -1 2 1 -5 4\n', output: '6', sample: true },
    { input: '1\n7\n', output: '7' },
    { input: '4\n-3 -1 -2 -4\n', output: '-1' },
    { input: '6\n2 -1 2 3 4 -5\n', output: '10' },
    { input: '5\n1000000000 1000000000 -1 1000000000 1000000000\n', output: '3999999999' },
    largeTest(),
  ],
};
