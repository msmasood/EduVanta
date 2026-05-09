import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// ─── Props ───────────────────────────────────────────────────────────────────

export type WidgetSkeletonVariant = "metric" | "chart" | "list" | "table";

export interface DashboardWidgetSkeletonProps {
  variant?: WidgetSkeletonVariant;
  /** Height for chart skeleton in pixels */
  chartHeight?: number;
  /** Number of list rows */
  rows?: number;
  className?: string;
}

// ─── Variant renderers ────────────────────────────────────────────────────────

function MetricSkeleton() {
  return (
    <>
      <Skeleton className="h-4 w-1/2 rounded" />
      <Skeleton className="h-8 w-3/4 rounded" />
      <Skeleton className="h-3 w-1/3 rounded" />
    </>
  );
}

function ChartSkeleton({ height }: { height: number }) {
  return (
    <>
      <Skeleton className="h-4 w-1/3 rounded" />
      <Skeleton className="mt-2 rounded-lg" style={{ height }} />
    </>
  );
}

function ListSkeleton({ rows }: { rows: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 py-2">
          <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-3.5 w-3/4 rounded" />
            <Skeleton className="h-3 w-1/2 rounded" />
          </div>
        </div>
      ))}
    </>
  );
}

function TableSkeleton({ rows }: { rows: number }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Skeleton className="h-8 w-full rounded" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-6 w-full rounded" style={{ opacity: 1 - i * 0.1 }} />
      ))}
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export function DashboardWidgetSkeleton({
  variant = "metric",
  chartHeight = 200,
  rows = 5,
  className,
}: DashboardWidgetSkeletonProps) {
  return (
    <Card
      className={cn("gap-3 p-4", className)}
      role="status"
      aria-busy="true"
      aria-label="Loading widget"
    >
      <CardHeader className="p-0">
        <Skeleton className="h-4 w-1/3 rounded" />
      </CardHeader>
      <CardContent className="flex flex-col gap-2 p-0">
        {variant === "metric" && <MetricSkeleton />}
        {variant === "chart" && <ChartSkeleton height={chartHeight} />}
        {variant === "list" && <ListSkeleton rows={rows} />}
        {variant === "table" && <TableSkeleton rows={rows} />}
      </CardContent>
    </Card>
  );
}
