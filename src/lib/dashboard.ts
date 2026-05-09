/**
 * Dashboard utility helpers for Phase 7+ dashboard widgets.
 */

import type { MoneyAmount } from "@/types/common";
import type { DashboardTrend } from "@/types/dashboard";
import { formatCurrency } from "@/lib/currency";

// ─── Chart colors ─────────────────────────────────────────────────────────────

/** CSS variable names for the 5 EduVanta chart colors. */
const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const;

/**
 * Return a CSS variable color string for the nth chart series.
 * Wraps around if index ≥ 5.
 */
export function getChartColor(index: number): string {
  return CHART_COLORS[((index % CHART_COLORS.length) + CHART_COLORS.length) % CHART_COLORS.length];
}

// ─── Trend helpers ────────────────────────────────────────────────────────────

export type TrendTone = "success" | "destructive" | "warning" | "muted";

/**
 * Map a trend direction + positiveIsGood flag to a semantic tone.
 *
 * @example
 *   getTrendTone("up", true)   → "success"
 *   getTrendTone("up", false)  → "destructive"
 *   getTrendTone("down", true) → "destructive"
 *   getTrendTone("neutral")    → "muted"
 */
export function getTrendTone(
  direction: DashboardTrend["direction"],
  positiveIsGood = true
): TrendTone {
  if (direction === "neutral") return "muted";
  const isUp = direction === "up";
  if (isUp === positiveIsGood) return "success";
  return "destructive";
}

/**
 * Format a trend percentage as a display string (e.g. "12.5%").
 */
export function formatTrendLabel(percentage: number): string {
  const abs = Math.abs(percentage);
  return `${abs.toFixed(1)}%`;
}

// ─── Value formatting ─────────────────────────────────────────────────────────

export interface FormatDashboardValueOptions {
  /** If provided, format as currency instead of plain number */
  money?: MoneyAmount;
  /** App locale for Intl formatting */
  locale?: string;
  /** Unit suffix (e.g. "%", "hrs") */
  unit?: string;
  /** Compact notation: 1500 → "1.5K", 1_500_000 → "1.5M" */
  compact?: boolean;
}

const BCP47: Record<string, string> = { en: "en-US", ar: "ar-AE", ur: "ur-PK" };

/**
 * Format a DashboardMetric value for display.
 * - If `money` is provided, delegates to formatCurrency.
 * - If `value` is a number, applies compact/unit formatting.
 * - Falls back to string coercion.
 */
export function formatDashboardValue(
  value: number | string,
  options: FormatDashboardValueOptions = {}
): string {
  const { money, locale = "en", unit, compact } = options;

  if (money) {
    return formatCurrency(money.amount, money.currency, locale);
  }

  if (typeof value === "number") {
    if (compact && value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)}M${unit ? ` ${unit}` : ""}`;
    }
    if (compact && value >= 1_000) {
      return `${(value / 1_000).toFixed(1)}K${unit ? ` ${unit}` : ""}`;
    }
    const bcp47 = BCP47[locale] ?? "en-US";
    const formatted = new Intl.NumberFormat(bcp47).format(value);
    return unit ? `${formatted} ${unit}` : formatted;
  }

  return unit ? `${String(value)} ${unit}` : String(value);
}

// ─── Trend tone CSS classes ───────────────────────────────────────────────────

/**
 * Return Tailwind text-color classes for a given TrendTone.
 */
export function getTrendColorClass(tone: TrendTone): string {
  const map: Record<TrendTone, string> = {
    success: "text-[var(--success)]",
    destructive: "text-destructive",
    warning: "text-[var(--warning-foreground)]",
    muted: "text-muted-foreground",
  };
  return map[tone];
}

/**
 * Return Tailwind bg-color classes for a given TrendTone.
 */
export function getTrendBgClass(tone: TrendTone): string {
  const map: Record<TrendTone, string> = {
    success: "bg-[var(--success)]/10",
    destructive: "bg-destructive/10",
    warning: "bg-[var(--warning)]/20",
    muted: "bg-muted",
  };
  return map[tone];
}
