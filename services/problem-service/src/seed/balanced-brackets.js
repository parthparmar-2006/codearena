import { starterCode } from './helpers.js';

const deep = '('.repeat(50000) + ')'.repeat(50000);

export default {
  slug: 'balanced-brackets',
  title: 'Balanced Brackets',
  difficulty: 'easy',
  timeLimitMs: 1000,
  memoryLimitMb: 256,
  statement: `A string of brackets is **balanced** if every opening bracket is closed by the same type of bracket, in the correct order.

Given a string made only of the characters ( ) [ ] { }, decide whether it is balanced.

### Input
A single line with the bracket string **s**.

### Output
Print **YES** if the string is balanced, otherwise print **NO**.

### Constraints
- 1 ≤ |s| ≤ 10^5
`,
  starterCode: starterCode('Read the bracket string, then print YES or NO'),
  tests: [
    { input: '([]{})\n', output: 'YES', sample: true },
    { input: '([)]\n', output: 'NO', sample: true },
    { input: '(((\n', output: 'NO' },
    { input: ']\n', output: 'NO' },
    { input: '{[()()]}\n', output: 'YES' },
    { input: `${deep}\n`, output: 'YES' },
  ],
};
