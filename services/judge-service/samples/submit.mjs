// Usage: node submit.mjs <file.cpp> <problem-slug>
// Submits the file and waits for the verdict. Override hosts with PROBLEMS_URL / SUBMISSIONS_URL.
import { readFile } from 'node:fs/promises';
import { setTimeout as sleep } from 'node:timers/promises';

const [file, slug] = process.argv.slice(2);
if (!file || !slug) {
  console.error('Usage: node submit.mjs <file.cpp> <problem-slug>');
  process.exit(1);
}

const problemsUrl = process.env.PROBLEMS_URL ?? 'http://localhost:4001';
const submissionsUrl = process.env.SUBMISSIONS_URL ?? 'http://localhost:4002';

async function request(url, options) {
  const res = await fetch(url, options);
  const body = await res.json();
  if (!res.ok) throw new Error(`${res.status}: ${body.error}`);
  return body;
}

const problem = await request(`${problemsUrl}/api/problems/${slug}`);
const code = await readFile(file, 'utf8');
const { id } = await request(`${submissionsUrl}/api/submissions`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ problemId: problem.id, language: 'cpp', code }),
});
console.log(`Submitted ${file} to "${problem.title}" as ${id}`);

let submission;
do {
  await sleep(1000);
  submission = await request(`${submissionsUrl}/api/submissions/${id}`);
  console.log(`  ${submission.status}`);
} while (submission.status !== 'DONE');

console.log(`Verdict: ${submission.verdict}  passed ${submission.passed}/${submission.total}  time ${submission.time_ms ?? '-'} ms`);
if (submission.compile_output) console.log(submission.compile_output);
