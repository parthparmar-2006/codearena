import { History } from 'lucide-react';
import { api } from '../lib/api.js';
import { formatTime, shortId, timeAgo } from '../lib/format.js';
import { isPending } from '../lib/verdicts.js';
import { useAsync } from '../hooks/useAsync.js';
import { useInterval } from '../hooks/useInterval.js';
import { VerdictPill } from './Pills.jsx';
import { EmptyState, Skeleton } from './Feedback.jsx';

export function RecentSubmissions({ problemId, refreshKey }) {
  const { data, error, reload } = useAsync(
    () => api.listSubmissions({ problemId, limit: 10 }),
    [problemId, refreshKey],
  );
  useInterval(reload, data?.some(isPending) ? 2000 : null);

  if (!data && !error) {
    return (
      <div className="space-y-2 p-4">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-8" />
        ))}
      </div>
    );
  }
  if (!data) return <EmptyState icon={History} title="Could not load submissions" />;
  if (data.length === 0) {
    return <EmptyState icon={History} title="No submissions yet">Your attempts on this problem will show up here.</EmptyState>;
  }

  return (
    <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
      {data.map((submission) => (
        <li key={submission.id} className="flex items-center gap-4 px-5 py-2.5 text-sm">
          <VerdictPill submission={submission} />
          <span className="font-mono text-xs text-zinc-400">{shortId(submission.id)}</span>
          <span className="ml-auto tabular-nums text-zinc-500 dark:text-zinc-400">{formatTime(submission.time_ms)}</span>
          <span className="w-16 text-right text-zinc-400">{timeAgo(submission.created_at)}</span>
        </li>
      ))}
    </ul>
  );
}
