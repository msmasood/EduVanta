import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// ─── Props ───────────────────────────────────────────────────────────────────

export interface ChartSkeletonProps {
  height?: number;
  /** Show axis skeleton bars on the left */
  showAxis?: boolean;
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function ChartSkeleton({ height = 240, showAxis = true, className }: ChartSkeletonProps) {
  return (
    <div
      className={cn("flex gap-2", className)}
      style={{ height }}
      role="status"
      aria-label="Loading chart"
      aria-busy="true"
    >
      {showAxis && (
        <div className="flex flex-col justify-between py-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-6 rounded" />
          ))}
        </div>
      )}
      <div className="flex flex-1 items-end gap-1.5 pb-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton
            key={i}
            className="flex-1 rounded-t"
            style={{ height: `${30 + ((i * 17 + 23) % 70)}%` }}
          />
        ))}
      </div>
    </div>
  );
}
