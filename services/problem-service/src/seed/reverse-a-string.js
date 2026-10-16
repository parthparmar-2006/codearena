import { starterCode } from './helpers.js';

const long = 'abc'.repeat(30000);
const reverse = (s) => [...s].reverse().join('');

export default {
  slug: 'reverse-a-string',
  title: 'Reverse a String',
  difficulty: 'easy',
  timeLimitMs: 1000,
  memoryLimitMb: 256,
  statement: `Given a string **s**, print it reversed.

### Input
A single line with the string **s**. It contains no spaces.

### Output
Print **s** with its characters in reverse order.

### Constraints
- 1 ≤ |s| ≤ 10^5
- **s** contains only letters, digits and punctuation
`,
  starterCode: starterCode('Read the string s, then print it reversed'),
  tests: [
    { input: 'hello\n', output: 'olleh', sample: true },
    { input: 'CodeArena\n', output: 'anerAedoC', sample: true },
    { input: 'a\n', output: 'a' },
    { input: 'racecar\n', output: 'racecar' },
    { input: 'Kubernetes!\n', output: '!setenrebuK' },
    { input: `${long}\n`, output: reverse(long) },
  ],
};
