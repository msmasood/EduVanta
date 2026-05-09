import * as React from "react";
import { cn } from "@/lib/utils";
import { MetricCard } from "@/components/cards/metric-card";
import type { DashboardMetric } from "@/types/dashboard";

// ─── Props ───────────────────────────────────────────────────────────────────

export interface StatsGridProps {
  metrics: DashboardMetric[];
  /** Icons mapped by metric label */
  icons?: Record<string, React.ReactNode>;
  locale?: string;
  loading?: boolean;
  compact?: boolean;
  /** Number of columns at large breakpoint: 2 or 4 (default 4) */
  columns?: 2 | 3 | 4;
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

const colClasses: Record<2 | 3 | 4, string> = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

export function StatsGrid({
  metrics,
  icons,
  locale = "en",
  loading = false,
  compact = false,
  columns = 4,
  className,
}: StatsGridProps) {
  const skeletonCount = metrics.length || 4;

  if (loading) {
    return (
      <div className={cn("grid gap-4", colClasses[columns], className)}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <MetricCard key={i} loading metric={undefined} />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("grid gap-4", colClasses[columns], className)}>
      {metrics.map((metric) => (
        <MetricCard
          key={metric.label}
          metric={metric}
          icon={icons?.[metric.label]}
          locale={locale}
          compact={compact}
        />
      ))}
    </div>
  );
}
