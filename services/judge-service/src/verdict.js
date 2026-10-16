import { outputsMatch } from './compare.js';

export function testVerdict(run, expectedOutput, timeLimitMs) {
  if (run.timedOut || run.signal === 'SIGXCPU' || run.timeMs > timeLimitMs) return 'TLE';
  if (run.truncated) return 'WA';
  if (run.exitCode !== 0 || run.signal) return 'RE';
  return outputsMatch(run.stdout, expectedOutput) ? 'AC' : 'WA';
}
