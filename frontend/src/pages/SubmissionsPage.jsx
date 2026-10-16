import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CircleAlert, History } from 'lucide-react';
import { api } from '../lib/api.js';
import { formatTime, shortId, timeAgo } from '../lib/format.js';
import { isPending } from '../lib/verdicts.js';
import { useAsync } from '../hooks/useAsync.js';
import { useInterval } from '../hooks/useInterval.js';
import { useToast } from '../components/Toast.jsx';
import { VerdictPill } from '../components/Pills.jsx';
import { EmptyState, Skeleton } from '../components/Feedback.jsx';

export function SubmissionsPage() {
  const { data: submissions, error, reload } = useAsync(() => api.listSubmissions({ limit: 50 }), []);
  const { data: problems } = useAsync(() => api.listProblems(), []);
  const [now, setNow] = useState(Date.now());
  const showToast = useToast();

  useInterval(reload, submissions?.some(isPending) ? 2000 : null);
  useInterval(() => setNow(Date.now()), 30_000);

  const errorMessage = error?.message;
  useEffect(() => {
    if (errorMessage) showToast(errorMessage);
  }, [errorMessage, showToast]);

  const problemsById = useMemo(() => new Map((problems ?? []).map((p) => [p.id, p])), [problems]);

  let body;
  if (!submissions && !error) {
    body = (
      <div className="space-y-3 p-4">
        {[0, 1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-6" />
        ))}
      </div>
    );
  } else if (!submissions) {
    body = <EmptyState icon={CircleAlert} title="Could not load submissions" />;
  } else if (submissions.length === 0) {
    body = (
      <EmptyState icon={History} title="No submissions yet">
        Open a problem and submit your first solution.
      </EmptyState>
    );
  } else {
    body = (
      <table className="w-full min-w-[560px] text-sm">
        <thead className="text-left text-xs text-zinc-500 dark:text-zinc-400">
          <tr>
            <th className="px-4 py-2.5 font-medium">ID</th>
            <th className="px-4 py-2.5 font-medium">Problem</th>
            <th className="px-4 py-2.5 font-medium">Verdict</th>
            <th className="px-4 py-2.5 text-right font-medium">Time</th>
            <th className="px-4 py-2.5 text-right font-medium">Submitted</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((s) => {
            const problem = problemsById.get(s.problem_id);
            return (
              <tr key={s.id} className="border-t border-zinc-200 dark:border-zinc-800">
                <td className="px-4 py-3 font-mono text-xs text-zinc-500 dark:text-zinc-400">{shortId(s.id)}</td>
                <td className="px-4 py-3">
                  {problem ? (
                    <Link
                      to={`/problems/${problem.slug}`}
                      className="focus-ring rounded font-medium transition-colors duration-150 hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      {problem.title}
                    </Link>
                  ) : (
                    <span className="text-zinc-500">Problem {s.problem_id}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <VerdictPill submission={s} />
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-zinc-500 dark:text-zinc-400">
                  {formatTime(s.time_ms)}
                </td>
                <td className="px-4 py-3 text-right text-zinc-500 dark:text-zinc-400">{timeAgo(s.created_at, now)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-2xl font-semibold tracking-tight">Submissions</h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">The 50 most recent submissions from everyone.</p>
      <div className="mt-8 overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">{body}</div>
    </main>
  );
}
