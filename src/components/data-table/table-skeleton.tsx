"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

/**
 * TableSkeleton — pulse-animated placeholder shown while table data is loading.
 * Renders a configurable number of skeleton rows and column cells.
 */
export function TableSkeleton({ rows = 5, columns = 5 }: TableSkeletonProps) {
  return (
    <div
      data-slot="table-skeleton"
      className="w-full space-y-3"
      aria-label="Loading table data"
      aria-busy="true"
    >
      {/* Header row */}
      <div className="flex gap-4 border-b pb-3">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Data rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className="flex gap-4 py-2">
          {Array.from({ length: columns }).map((_, colIdx) => (
            <Skeleton
              key={colIdx}
              className="h-4 flex-1"
              style={{ opacity: 1 - rowIdx * 0.06 }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
