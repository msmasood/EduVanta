import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getTrendTone,
  getTrendColorClass,
  getTrendBgClass,
  formatTrendLabel,
  formatDashboardValue,
} from "@/lib/dashboard";
import type { DashboardTrend } from "@/types/dashboard";

// ─── Props ───────────────────────────────────────────────────────────────────

export interface TrendCardProps {
  label: string;
  currentValue: number | string;
  previousValue?: number | string;
  /** Percent change magnitude (unsigned). Direction determines sign display. */
  percentChange: number;
  direction: DashboardTrend["direction"];
  /**
   * When true, "up" is good (green). When false, "up" is bad (red).
   * E.g. for "pending fees", positiveIsGood=false so increase is red.
   */
  positiveIsGood?: boolean;
  /** Unit suffix for the current value */
  unit?: string;
  /** Optional mini sparkline slot */
  sparkline?: React.ReactNode;
  loading?: boolean;
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function TrendCard({
  label,
  currentValue,
  previousValue,
  percentChange,
  direction,
  positiveIsGood = true,
  unit,
  sparkline,
  loading = false,
  className,
}: TrendCardProps) {
  const tone = getTrendTone(direction, positiveIsGood);
  const colorClass = getTrendColorClass(tone);
  const bgClass = getTrendBgClass(tone);

  const directionSymbol =
    direction === "up" ? "↑" : direction === "down" ? "↓" : "→";

  const displayValue = formatDashboardValue(currentValue, { unit, compact: true });
  const displayPrevious =
    previousValue !== undefined
      ? formatDashboardValue(previousValue, { unit, compact: true })
      : null;

  if (loading) {
    return (
      <Card className={cn("gap-3", className)} aria-busy="true">
        <Skeleton className="h-4 w-1/2 rounded" />
        <Skeleton className="h-7 w-2/3 rounded" />
        <Skeleton className="h-3 w-1/3 rounded" />
      </Card>
    );
  }

  return (
    <Card className={cn("gap-3 transition-shadow hover:shadow-md", className)}>
      <CardHeader className="pb-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex items-end justify-between gap-2 pb-3">
        <div>
          <div className="font-heading text-2xl font-semibold tabular-nums">
            {displayValue}
          </div>

          {displayPrevious && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              vs {displayPrevious}
            </p>
          )}

          <div
            className={cn(
              "mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
              bgClass,
              colorClass
            )}
            aria-label={`${label}: ${directionSymbol} ${formatTrendLabel(percentChange)}`}
          >
            <span aria-hidden="true">{directionSymbol}</span>
            <span>{formatTrendLabel(percentChange)}</span>
          </div>
        </div>

        {sparkline && (
          <div className="shrink-0 opacity-80" aria-hidden="true">
            {sparkline}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
