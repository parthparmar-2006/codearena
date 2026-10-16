import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <main className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <p className="font-mono text-sm text-indigo-600 dark:text-indigo-400">404</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        The page you are looking for does not exist or has moved.
      </p>
      <Link
        to="/"
        className="focus-ring mt-6 inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-3.5 py-2 text-sm font-medium transition-colors duration-150 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
      >
        <ArrowLeft aria-hidden className="h-4 w-4" />
        Back to problems
      </Link>
    </main>
  );
}
