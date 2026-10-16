import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CircleAlert, Code, LoaderCircle, RotateCcw, Send } from 'lucide-react';
import { api } from '../lib/api.js';
import { storage } from '../lib/storage.js';
import { isMac } from '../lib/format.js';
import { useAsync } from '../hooks/useAsync.js';
import { useSubmission } from '../hooks/useSubmission.js';
import { useToast } from '../components/Toast.jsx';
import { Button } from '../components/Button.jsx';
import { CodeEditor } from '../components/CodeEditor.jsx';
import { EditorSkeleton, EmptyState, Skeleton } from '../components/Feedback.jsx';
import { ProblemStatement } from '../components/ProblemStatement.jsx';
import { ResultPanel } from '../components/ResultPanel.jsx';
import { RecentSubmissions } from '../components/RecentSubmissions.jsx';
import { NotFoundPage } from './NotFoundPage.jsx';

const TABS = [
  ['result', 'Result'],
  ['recent', 'Recent submissions'],
];

const SPLIT = 'mx-auto grid max-w-screen-2xl lg:h-[calc(100dvh-3.5rem)] lg:grid-cols-2';
const LEFT_PANE =
  'border-b border-zinc-200 px-4 py-8 sm:px-6 lg:overflow-y-auto lg:border-b-0 lg:border-r dark:border-zinc-800';
const BAR = 'flex items-center border-zinc-200 px-3 dark:border-zinc-800';

export function ProblemPage() {
  const { slug } = useParams();
  const { data: problem, error } = useAsync(() => api.getProblem(slug), [slug]);

  if (error?.status === 404) return <NotFoundPage />;
  if (error) {
    return (
      <EmptyState icon={CircleAlert} title="Could not load this problem">
        {error.message}
      </EmptyState>
    );
  }
  if (!problem || problem.slug !== slug) return <ProblemSkeleton />;
  return <Workspace key={problem.slug} problem={problem} />;
}

function Workspace({ problem }) {
  const showToast = useToast();
  const [code, setCode] = useState(() => storage.getDraft(problem.slug) ?? problem.starter_code);
  const [submissionId, setSubmissionId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [tab, setTab] = useState('result');
  const { submission, error: pollError } = useSubmission(submissionId);
  const busy = submitting || (submissionId !== null && !pollError && submission?.status !== 'DONE');

  useEffect(() => {
    storage.setDraft(problem.slug, code);
  }, [problem.slug, code]);

  useEffect(() => {
    if (pollError) showToast(pollError.message);
  }, [pollError, showToast]);

  useEffect(() => {
    if (submission?.verdict === 'AC') storage.markSolved(problem.id);
  }, [submission?.verdict, problem.id]);

  const submit = useCallback(async () => {
    if (busy) return;
    if (!code.trim()) {
      showToast('Write some code before submitting');
      return;
    }
    setSubmitting(true);
    try {
      const { id } = await api.submit(problem.id, code);
      setSubmissionId(id);
      setTab('result');
    } catch (err) {
      showToast(err.message);
    } finally {
      setSubmitting(false);
    }
  }, [busy, code, problem.id, showToast]);

  // Capture phase runs before Monaco sees the key, so the shortcut also works inside the editor.
  useEffect(() => {
    function onKeyDown(event) {
      if (!(event.ctrlKey || event.metaKey) || event.key !== 'Enter') return;
      event.preventDefault();
      event.stopPropagation();
      if (!event.repeat) submit();
    }
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [submit]);

  return (
    <div className={SPLIT}>
      <section className={LEFT_PANE}>
        <ProblemStatement problem={problem} />
      </section>

      <section className="flex flex-col lg:min-h-0">
        <div className={`${BAR} h-11 justify-between border-b`}>
          <span className="inline-flex items-center gap-2 px-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            <Code aria-hidden className="h-3.5 w-3.5" />
            C++17
          </span>
          <Button onClick={() => setCode(problem.starter_code)} className="h-8 px-2.5 text-xs">
            <RotateCcw aria-hidden className="h-3.5 w-3.5" />
            Reset
          </Button>
        </div>

        <div className="h-[55vh] min-h-80 lg:h-auto lg:min-h-0 lg:flex-1">
          <CodeEditor value={code} onChange={setCode} />
        </div>

        <div className={`${BAR} h-14 justify-end gap-3 border-y`}>
          <kbd className="hidden font-sans text-xs text-zinc-400 sm:inline">{isMac ? '⌘' : 'Ctrl'} + Enter</kbd>
          <Button variant="primary" onClick={submit} disabled={busy} className="h-9 px-4">
            {busy ? (
              <LoaderCircle aria-hidden className="h-4 w-4 animate-spin" />
            ) : (
              <Send aria-hidden className="h-4 w-4" />
            )}
            {busy ? 'Judging' : 'Submit'}
          </Button>
        </div>

        <div className="flex h-72 flex-col lg:h-[38%] lg:shrink-0">
          <div role="tablist" className={`${BAR} gap-4 border-b`}>
            {TABS.map(([id, label]) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={tab === id}
                onClick={() => setTab(id)}
                className={`focus-ring -mb-px border-b-2 py-2.5 text-sm transition-colors duration-150 ${
                  tab === id
                    ? 'border-indigo-500 font-medium text-zinc-900 dark:text-zinc-100'
                    : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div role="tabpanel" className="min-h-0 flex-1 overflow-y-auto">
            {tab === 'result' ? (
              <ResultPanel submission={submission} waiting={busy} />
            ) : (
              <RecentSubmissions problemId={problem.id} refreshKey={`${submissionId}:${submission?.status}`} />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function ProblemSkeleton() {
  return (
    <div className={SPLIT}>
      <section className={LEFT_PANE}>
        <div className="mx-auto max-w-2xl space-y-4">
          <Skeleton className="h-7 w-2/3" />
          <Skeleton className="h-5 w-48" />
          <Skeleton className="mt-6 h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="mt-6 h-24 w-full" />
        </div>
      </section>
      <section>
        <EditorSkeleton />
      </section>
    </div>
  );
}
