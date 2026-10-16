export const VERDICTS = {
  AC: {
    label: 'Accepted',
    text: 'text-emerald-600 dark:text-emerald-400',
    pill: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20',
  },
  WA: {
    label: 'Wrong Answer',
    text: 'text-rose-600 dark:text-rose-400',
    pill: 'bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/20',
  },
  TLE: {
    label: 'Time Limit Exceeded',
    text: 'text-amber-600 dark:text-amber-400',
    pill: 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20',
  },
  RE: {
    label: 'Runtime Error',
    text: 'text-orange-600 dark:text-orange-400',
    pill: 'bg-orange-50 text-orange-700 ring-orange-600/20 dark:bg-orange-500/10 dark:text-orange-400 dark:ring-orange-500/20',
  },
  CE: {
    label: 'Compilation Error',
    text: 'text-slate-600 dark:text-slate-400',
    pill: 'bg-slate-100 text-slate-700 ring-slate-600/20 dark:bg-slate-500/10 dark:text-slate-300 dark:ring-slate-500/20',
  },
};

export const PENDING_PILL =
  'bg-zinc-100 text-zinc-600 ring-zinc-500/20 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700';

export const PENDING_LABELS = { QUEUED: 'Queued', RUNNING: 'Running' };

export const isPending = (submission) => submission.status !== 'DONE';
