import Markdown from 'react-markdown';
import { Clock, MemoryStick } from 'lucide-react';
import { DifficultyPill } from './Pills.jsx';
import { CopyButton } from './CopyButton.jsx';

function LimitBadge({ icon: Icon, children }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 px-2 py-0.5 text-xs text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
      <Icon aria-hidden className="h-3.5 w-3.5" />
      {children}
    </span>
  );
}

function IoBlock({ label, text }) {
  return (
    <div className="flex min-w-0 flex-col overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center justify-between border-b border-zinc-200 py-1 pl-3 pr-1.5 text-xs font-medium text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        {label}
        <CopyButton text={text} />
      </div>
      <pre className="flex-1 overflow-x-auto bg-zinc-50 p-3 font-mono text-[13px] leading-6 dark:bg-zinc-900/50">{text}</pre>
    </div>
  );
}

export function ProblemStatement({ problem }) {
  return (
    <article className="mx-auto max-w-2xl">
      <h1 className="text-xl font-semibold tracking-tight">
        {problem.id}. {problem.title}
      </h1>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <DifficultyPill difficulty={problem.difficulty} />
        <LimitBadge icon={Clock}>{problem.time_limit_ms / 1000} s</LimitBadge>
        <LimitBadge icon={MemoryStick}>{problem.memory_limit_mb} MB</LimitBadge>
      </div>

      <div className="markdown mt-6">
        <Markdown>{problem.statement_md}</Markdown>
      </div>

      {problem.samples.map((sample, i) => (
        <section key={i} className="mt-8">
          <h2 className="mb-3 text-sm font-semibold">Example {i + 1}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <IoBlock label="Input" text={sample.input} />
            <IoBlock label="Output" text={sample.expected_output} />
          </div>
        </section>
      ))}
    </article>
  );
}
