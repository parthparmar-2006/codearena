import { starterCode } from './helpers.js';

export default {
  slug: 'sum-of-two-numbers',
  title: 'Sum of Two Numbers',
  difficulty: 'easy',
  timeLimitMs: 1000,
  memoryLimitMb: 256,
  statement: `Given two integers **a** and **b**, print their sum.

### Input
A single line with two integers **a** and **b**.

### Output
Print one integer: **a + b**.

### Constraints
- -10⁹ ≤ a, b ≤ 10⁹
`,
  starterCode: starterCode('Read a and b, then print a + b'),
  tests: [
    { input: '2 3\n', output: '5', sample: true },
    { input: '-4 10\n', output: '6', sample: true },
    { input: '0 0\n', output: '0' },
    { input: '-7 -8\n', output: '-15' },
    { input: '1000000000 1000000000\n', output: '2000000000' },
    { input: '123456789 987654321\n', output: '1111111110' },
  ],
};
