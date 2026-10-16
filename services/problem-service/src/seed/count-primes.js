import { starterCode } from './helpers.js';

export default {
  slug: 'count-primes',
  title: 'Count Primes up to N',
  difficulty: 'medium',
  timeLimitMs: 1000,
  memoryLimitMb: 256,
  statement: `Count how many prime numbers are less than or equal to **N**.

A prime is an integer greater than 1 whose only divisors are 1 and itself.

### Input
A single integer **N**.

### Output
Print the number of primes **p** with **p ≤ N**.

### Constraints
- 1 ≤ N ≤ 5,000,000

Checking every number by trial division is too slow for the largest tests. Think about the Sieve of Eratosthenes.
`,
  starterCode: starterCode('Read N, then print the number of primes up to N'),
  tests: [
    { input: '10\n', output: '4', sample: true },
    { input: '2\n', output: '1', sample: true },
    { input: '1\n', output: '0' },
    { input: '100\n', output: '25' },
    { input: '1000000\n', output: '78498' },
    { input: '5000000\n', output: '348513' },
  ],
};
