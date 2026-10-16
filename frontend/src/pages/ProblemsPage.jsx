import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, CircleAlert, Inbox, Search } from 'lucide-react';
import { api } from '../lib/api.js';
import { storage } from '../lib/storage.js';
import { useAsync } from '../hooks/useAsync.js';
import { useToast } from '../components/Toast.jsx';
import { DifficultyPill } from '../components/Pills.jsx';
import { EmptyState, Skeleton } from '../components/Feedback.jsx';

const FILTERS = ['all', 'easy', 'medium', 'hard'];

function FilterChip({ active, onClick, children }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`focus-ring rounded-lg border px-3 py-1.5 text-sm capitalize transition-colors duration-150 ${
        active
          ? 'border-indigo-500/40 bg-indigo-50 text-indigo-700 dark:border-indigo-400/30 dark:bg-indigo-500/10 dark:text-indigo-300'
          : 'border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-100'
      }`}
    >
      {children}
    </button>
  );
}

export function ProblemsPage() {
  const { data: problems, error } = useAsync(() => api.listProblems(), []);
  const [query, setQuery] = useState('');
  const [difficulty, setDifficulty] = useState('all');
  const [solved] = useState(() => storage.getSolved());
  const showToast = useToast();

  useEffect(() => {
    if (error) showToast(error.message);
  }, [error, showToast]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return (problems ?? []).filter(
      (p) => (difficulty === 'all' || p.difficulty === difficulty) && p.title.toLowerCase().includes(needle),
    );
  }, [problems, query, difficulty]);

  let body;
  if (!problems && !error) {
    body = (
      <div className="space-y-3 p-4">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-6" />
        ))}
      </div>
    );
  } else if (!problems) {
    body = (
      <EmptyState icon={CircleAlert} title="Could not load problems">
        Check that the problem service is running, then refresh the page.
      </EmptyState>
    );
  } else if (visible.length === 0) {
    body = (
      <EmptyState icon={Inbox} title="No problems match">
        Try a different search or difficulty.
      </EmptyState>
    );
  } else {
    body = (
      <table className="w-full text-sm">
        <thead className="text-left text-xs text-zinc-500 dark:text-zinc-400">
          <tr>
            <th className="w-14 px-4 py-2.5 font-medium">#</th>
            <th className="px-4 py-2.5 font-medium">Title</th>
            <th className="w-28 px-4 py-2.5 font-medium">Difficulty</th>
            <th className="w-16 px-4 py-2.5 text-right font-medium">
              <span className="sr-only">Solved</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {visible.map((p) => (
            <tr
              key={p.id}
              className="border-t border-zinc-200 transition-colors duration-150 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900/60"
            >
              <td className="px-4 py-3 tabular-nums text-zinc-400">{p.id}</td>
              <td className="px-4 py-3">
                <Link
                  to={`/problems/${p.slug}`}
                  className="focus-ring rounded font-medium transition-colors duration-150 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  {p.title}
                </Link>
              </td>
              <td className="px-4 py-3">
                <DifficultyPill difficulty={p.difficulty} />
              </td>
              <td className="px-4 py-3">
                {solved.has(p.id) && <Check aria-label="Solved" className="ml-auto h-4 w-4 text-emerald-500" />}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-2xl font-semibold tracking-tight">Problems</h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Pick a problem, write C++17 in the browser, and get a verdict in seconds.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative block sm:w-72">
          <span className="sr-only">Search problems</span>
          <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search problems"
            className="focus-ring h-9 w-full rounded-lg border border-zinc-200 bg-transparent pl-9 pr-3 text-sm transition-colors duration-150 placeholder:text-zinc-400 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700"
          />
        </label>
        <div role="group" aria-label="Filter by difficulty" className="flex flex-wrap gap-1.5">
          {FILTERS.map((filter) => (
            <FilterChip key={filter} active={difficulty === filter} onClick={() => setDifficulty(filter)}>
              {filter}
            </FilterChip>
          ))}
        </div>
      </div>

      <div className="mt-4 overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">{body}</div>
    </main>
  );
}
