const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-muted rounded ${className}`} />
);

export const SkeletonCard = () => (
  <div className="bg-card rounded-xl border border-border p-6 space-y-4">
    <Skeleton className="h-5 w-32" />
    <Skeleton className="h-8 w-16" />
    <Skeleton className="h-3 w-24" />
  </div>
);

export const SkeletonTable = ({ rows = 5 }) => (
  <div className="bg-card rounded-xl border border-border overflow-hidden">
    <div className="border-b border-border bg-muted/50 px-4 py-3 flex gap-6">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-3 w-20" />
      ))}
    </div>
    <div className="divide-y divide-border">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="px-4 py-3 flex gap-6">
          {[...Array(4)].map((_, j) => (
            <Skeleton key={j} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonText = ({ lines = 3 }) => (
  <div className="space-y-3">
    {[...Array(lines)].map((_, i) => (
      <Skeleton key={i} className={`h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`} />
    ))}
  </div>
);

export default Skeleton;
