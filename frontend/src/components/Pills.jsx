import { LoaderCircle } from 'lucide-react';
import { VERDICTS, PENDING_PILL, PENDING_LABELS } from '../lib/verdicts.js';

const DIFFICULTY = {
  easy: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20',
  medium: 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20',
  hard: 'bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/20',
};

export function Pill({ className = '', children }) {
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${className}`}
    >
      {children}
    </span>
  );
}

export function DifficultyPill({ difficulty }) {
  return <Pill className={`capitalize ${DIFFICULTY[difficulty]}`}>{difficulty}</Pill>;
}

export function VerdictPill({ submission }) {
  if (submission.status !== 'DONE') {
    return (
      <Pill className={PENDING_PILL}>
        <LoaderCircle aria-hidden className="h-3 w-3 animate-spin" />
        {PENDING_LABELS[submission.status]}
      </Pill>
    );
  }
  const verdict = VERDICTS[submission.verdict];
  return <Pill className={verdict.pill}>{verdict.label}</Pill>;
}
