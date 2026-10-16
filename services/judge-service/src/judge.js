import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { runProcess } from './runner.js';
import { testVerdict } from './verdict.js';

const COMPILE_TIMEOUT_MS = 10_000;
const COMPILE_OUTPUT_LIMIT = 4096;
const MAX_OUTPUT_BYTES = 1024 * 1024;
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const WALL_CLOCK_GRACE_MS = 500;

async function compile(jobDir) {
  const result = await runProcess('g++', ['-O2', '-std=c++17', '-o', 'main', 'main.cpp'], {
    cwd: jobDir,
    timeoutMs: COMPILE_TIMEOUT_MS,
    maxOutputBytes: MAX_OUTPUT_BYTES,
  });
  if (result.timedOut) return { ok: false, output: 'Compilation timed out' };
  const output = (result.stderr + result.stdout).slice(0, COMPILE_OUTPUT_LIMIT);
  return { ok: result.exitCode === 0, output };
}

function runTest(jobDir, input, { time_limit_ms, memory_limit_mb }) {
  const limits = [
    `--as=${memory_limit_mb * 1024 * 1024}`,
    `--cpu=${Math.ceil(time_limit_ms / 1000) + 1}`,
    '--nproc=64',
    `--fsize=${MAX_FILE_BYTES}`,
  ];
  return runProcess('prlimit', [...limits, './main'], {
    cwd: jobDir,
    input,
    timeoutMs: time_limit_ms + WALL_CLOCK_GRACE_MS,
    maxOutputBytes: MAX_OUTPUT_BYTES,
  });
}

export async function judge(code, problem, jobDir) {
  const total = problem.testcases.length;
  await mkdir(jobDir, { recursive: true });
  await writeFile(join(jobDir, 'main.cpp'), code);

  const compiled = await compile(jobDir);
  if (!compiled.ok) {
    return { verdict: 'CE', passed: 0, total, time_ms: null, compile_output: compiled.output };
  }

  let passed = 0;
  let maxTimeMs = 0;
  for (const testcase of problem.testcases) {
    const run = await runTest(jobDir, testcase.input, problem);
    maxTimeMs = Math.max(maxTimeMs, run.timeMs);
    const verdict = testVerdict(run, testcase.expected_output, problem.time_limit_ms);
    if (verdict !== 'AC') return { verdict, passed, total, time_ms: maxTimeMs, compile_output: null };
    passed += 1;
  }
  return { verdict: 'AC', passed, total, time_ms: maxTimeMs, compile_output: null };
}
