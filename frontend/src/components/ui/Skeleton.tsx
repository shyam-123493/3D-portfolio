import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  lines?: number
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-lg bg-border-subtle/60',
        className,
      )}
    />
  )
}

export function CardSkeleton({ lines = 3 }: SkeletonProps) {
  return (
    <div className="surface-card p-6 space-y-3">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-5 w-2/3" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="h-3 w-full" />
      ))}
    </div>
  )
}

export function TimelineItemSkeleton() {
  return (
    <div className="flex items-start gap-4 py-5 border-t border-border-subtle">
      <div className="flex flex-col items-center pt-1 flex-shrink-0">
        <Skeleton className="w-2.5 h-2.5 rounded-full" />
      </div>
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  )
}
