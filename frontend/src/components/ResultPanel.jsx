import { LoaderCircle, Terminal } from 'lucide-react';
import { VERDICTS, PENDING_LABELS } from '../lib/verdicts.js';
import { formatTime, isMac } from '../lib/format.js';
import { EmptyState } from './Feedback.jsx';

export function ResultPanel({ submission, waiting }) {
  if (!submission && !waiting) {
    return (
      <EmptyState icon={Terminal} title="No result yet">
        Press Submit or {isMac ? '⌘' : 'Ctrl'} + Enter to judge your code against every test.
      </EmptyState>
    );
  }

  if (!submission || submission.status !== 'DONE') {
    const label = submission ? PENDING_LABELS[submission.status] : 'Submitting';
    return (
      <div className="flex items-center gap-3 px-5 py-6 text-zinc-500 dark:text-zinc-400">
        <LoaderCircle aria-hidden className="h-5 w-5 animate-spin" />
        <span className="text-lg font-medium">{label}…</span>
      </div>
    );
  }

  const verdict = VERDICTS[submission.verdict];
  return (
    <div className="px-5 py-5">
      <p className={`text-2xl font-semibold tracking-tight ${verdict.text}`}>{verdict.label}</p>
      <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-zinc-500 dark:text-zinc-400">
        <span>
          Passed{' '}
          <strong className="font-medium text-zinc-900 dark:text-zinc-100">
            {submission.passed}/{submission.total}
          </strong>{' '}
          tests
        </span>
        <span>
          Time <strong className="font-medium text-zinc-900 dark:text-zinc-100">{formatTime(submission.time_ms)}</strong>
        </span>
      </div>
      {submission.compile_output && (
        <pre className="mt-4 overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-50 p-3 font-mono text-xs leading-5 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-300">
          {submission.compile_output}
        </pre>
      )}
    </div>
  );
}
