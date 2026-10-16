import { starterCode, createRandom } from './helpers.js';

function largeTest() {
  const n = 100000;
  const random = createRandom(7);
  const values = Array.from({ length: n }, (_, i) => 2 * i);
  const queries = Array.from({ length: n }, () => random(-5, 2 * n + 5));
  const answers = queries.map((q) => (q >= 0 && q % 2 === 0 && q / 2 < n ? q / 2 : -1));
  return {
    input: `${n} ${n}\n${values.join(' ')}\n${queries.join(' ')}\n`,
    output: answers.join('\n'),
  };
}

export default {
  slug: 'binary-search',
  title: 'Binary Search',
  difficulty: 'medium',
  timeLimitMs: 1000,
  memoryLimitMb: 256,
  statement: `You are given a sorted array of **n** distinct integers and **q** queries. For each query value **x**, print the 0-based index of **x** in the array, or **-1** if it is not present.

### Input
- The first line has two integers **n** and **q**.
- The second line has **n** distinct integers in increasing order.
- The third line has **q** integers, the queries.

### Output
Print **q** lines, the answer for each query in order.

### Constraints
- 1 ≤ n, q ≤ 10^5
- -10^9 ≤ every value ≤ 10^9
`,
  starterCode: starterCode('Read the array and queries, then print each index or -1'),
  tests: [
    { input: '5 3\n1 3 5 7 9\n3 4 9\n', output: '1\n-1\n4', sample: true },
    { input: '1 2\n42\n42 7\n', output: '0\n-1' },
    { input: '6 4\n-10 -3 0 4 8 15\n-10 15 5 0\n', output: '0\n5\n-1\n2' },
    { input: '3 3\n-1000000000 0 1000000000\n1000000000 -1000000000 1\n', output: '2\n0\n-1' },
    largeTest(),
  ],
};
