import { rm } from 'node:fs/promises';
import { join } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import { judge } from './judge.js';

const QUEUE_KEY = 'judge:queue';
const POP_TIMEOUT_SECONDS = 2;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const INTERNAL_ERROR_RESULT = {
  status: 'DONE',
  verdict: 'RE',
  passed: 0,
  total: 0,
  time_ms: null,
  compile_output: 'Internal judge error. Please submit again.',
};

async function processJob(id, { api, jobsDir }) {
  const jobDir = join(jobsDir, id);
  try {
    const submission = await api.getSubmission(id);
    const problem = await api.getTestcases(submission.problem_id);
    await api.updateSubmission(id, { status: 'RUNNING' });

    const result = await judge(submission.code, problem, jobDir);
    await api.updateSubmission(id, { status: 'DONE', ...result });
    console.log(`Judged ${id}: ${result.verdict} ${result.passed}/${result.total} ${result.time_ms ?? '-'}ms`);
  } catch (err) {
    console.error(`Judging ${id} failed: ${err.message}`);
    await api.updateSubmission(id, INTERNAL_ERROR_RESULT).catch((patchErr) => {
      console.error(`Could not report failure for ${id}: ${patchErr.message}`);
    });
  } finally {
    await rm(jobDir, { recursive: true, force: true });
  }
}

export async function runWorker({ queue, api, jobsDir, isStopping }) {
  console.log('judge worker waiting for jobs');
  while (!isStopping()) {
    try {
      const item = await queue.brpop(QUEUE_KEY, POP_TIMEOUT_SECONDS);
      if (!item) continue;
      const id = item[1];
      if (!UUID_PATTERN.test(id)) {
        console.error(`Skipping malformed job id: ${id}`);
        continue;
      }
      await processJob(id, { api, jobsDir });
    } catch (err) {
      console.error(`Worker loop error: ${err.message}`);
      await sleep(1000);
    }
  }
}
