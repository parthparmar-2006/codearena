export function Skeleton({ className = '', style }) {
  return (
    <div aria-hidden style={style} className={`animate-pulse rounded-md bg-zinc-200/70 dark:bg-zinc-800/70 ${className}`} />
  );
}

export function EditorSkeleton() {
  return (
    <div className="space-y-3 p-4">
      {[40, 64, 52, 72, 30, 58].map((width, i) => (
        <Skeleton key={i} className="h-3.5" style={{ width: `${width}%` }} />
      ))}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, children }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      {Icon && (
        <div className="mb-3 rounded-lg border border-zinc-200 p-2.5 text-zinc-400 dark:border-zinc-800 dark:text-zinc-500">
          <Icon aria-hidden className="h-5 w-5" />
        </div>
      )}
      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{title}</p>
      {children && <p className="mt-1 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">{children}</p>}
    </div>
  );
}
