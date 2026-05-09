import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  formatDashboardValue,
  getTrendTone,
  getTrendColorClass,
  getTrendBgClass,
  formatTrendLabel,
} from "@/lib/dashboard";
import type { DashboardMetric, MetricVariant } from "@/types/dashboard";

// ─── Variant styles ──────────────────────────────────────────────────────────

const variantBorderMap: Record<MetricVariant, string> = {
  default: "",
  success: "ring-[var(--success)]/20",
  warning: "ring-[var(--warning)]/30",
  destructive: "ring-destructive/20",
  info: "ring-[var(--info)]/20",
};

const variantIconBgMap: Record<MetricVariant, string> = {
  default: "bg-primary/10 text-primary",
  success: "bg-[var(--success)]/10 text-[var(--success)]",
  warning: "bg-[var(--warning)]/20 text-[var(--warning-foreground)]",
  destructive: "bg-destructive/10 text-destructive",
  info: "bg-[var(--info)]/10 text-[var(--info)]",
};

// ─── Props ───────────────────────────────────────────────────────────────────

export interface MetricCardProps {
  metric?: DashboardMetric;
  /** Override label */
  title?: string;
  /** Override value display string (already formatted) */
  value?: string | number;
  /** Sub-label below value */
  subtitle?: string;
  /** Lucide icon element */
  icon?: React.ReactNode;
  variant?: MetricVariant;
  /** App locale for currency/number formatting */
  locale?: string;
  loading?: boolean;
  compact?: boolean;
  className?: string;
  "aria-label"?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function MetricCard({
  metric,
  title,
  value,
  subtitle,
  icon,
  variant = "default",
  locale = "en",
  loading = false,
  compact = false,
  className,
  "aria-label": ariaLabel,
}: MetricCardProps) {
  // Resolve display values from metric or direct props
  const resolvedTitle = title ?? metric?.label ?? "";
  const resolvedVariant: MetricVariant = metric?.variant ?? variant;
  const resolvedSubtitle = subtitle ?? metric?.description;

  const displayValue = React.useMemo(() => {
    if (value !== undefined) return String(value);
    if (!metric) return "—";
    return formatDashboardValue(metric.value, {
      money: metric.moneyValue,
      locale,
      unit: metric.unit,
      compact,
    });
  }, [metric, value, locale, compact]);

  if (loading) {
    return (
      <Card
        className={cn("p-4", compact ? "gap-2 py-3" : "gap-4", className)}
        aria-busy="true"
        aria-label={ariaLabel ?? resolvedTitle}
      >
        <Skeleton className="h-4 w-1/2 rounded" />
        <Skeleton className="h-8 w-3/4 rounded" />
        <Skeleton className="h-3 w-1/3 rounded" />
      </Card>
    );
  }

  const trend = metric?.trend;
  const tone = trend ? getTrendTone(trend.direction, true) : null;

  return (
    <Card
      className={cn(
        "transition-shadow hover:shadow-md",
        variantBorderMap[resolvedVariant],
        compact ? "gap-2 py-3" : "gap-3",
        className
      )}
      aria-label={ariaLabel ?? resolvedTitle}
    >
      <CardHeader className="pb-0">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {resolvedTitle}
          </CardTitle>
          {icon && (
            <span
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                variantIconBgMap[resolvedVariant]
              )}
              aria-hidden="true"
            >
              {icon}
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className={cn("font-heading font-semibold tabular-nums", compact ? "text-2xl" : "text-3xl")}>
          {displayValue}
        </div>

        {resolvedSubtitle && (
          <CardDescription className="mt-0.5 text-xs">
            {resolvedSubtitle}
          </CardDescription>
        )}

        {trend && tone && (
          <div className={cn("mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium", getTrendBgClass(tone), getTrendColorClass(tone))}>
            <span aria-hidden="true">
              {trend.direction === "up" ? "↑" : trend.direction === "down" ? "↓" : "→"}
            </span>
            <span>
              {formatTrendLabel(trend.percentage)} {trend.label}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
