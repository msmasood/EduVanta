"use client";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// ─── Status variant map ───────────────────────────────────────────────────────

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
  {
    variants: {
      status: {
        // ── Positive states ──
        active:
          "border-transparent bg-success/15 text-success dark:bg-success/20",
        approved:
          "border-transparent bg-success/15 text-success dark:bg-success/20",
        paid: "border-transparent bg-success/15 text-success dark:bg-success/20",
        present:
          "border-transparent bg-success/15 text-success dark:bg-success/20",
        success:
          "border-transparent bg-success/15 text-success dark:bg-success/20",
        // ── Cautionary states ──
        pending:
          "border-transparent bg-warning/15 text-warning-foreground dark:bg-warning/20",
        due: "border-transparent bg-warning/15 text-warning-foreground dark:bg-warning/20",
        warning:
          "border-transparent bg-warning/15 text-warning-foreground dark:bg-warning/20",
        // ── Negative states ──
        suspended:
          "border-transparent bg-destructive/10 text-destructive dark:bg-destructive/20",
        rejected:
          "border-transparent bg-destructive/10 text-destructive dark:bg-destructive/20",
        overdue:
          "border-transparent bg-destructive/10 text-destructive dark:bg-destructive/20",
        absent:
          "border-transparent bg-destructive/10 text-destructive dark:bg-destructive/20",
        destructive:
          "border-transparent bg-destructive/10 text-destructive dark:bg-destructive/20",
        // ── Intermediate states ──
        partial:
          "border-transparent bg-[oklch(0.776_0.187_64/0.15)] text-[oklch(0.5_0.14_64)] dark:bg-[oklch(0.776_0.187_64/0.2)]",
        late: "border-transparent bg-[oklch(0.776_0.187_64/0.15)] text-[oklch(0.5_0.14_64)] dark:bg-[oklch(0.776_0.187_64/0.2)]",
        // ── Info state ──
        info: "border-transparent bg-info/15 text-info dark:bg-info/20",
        // ── Neutral / off states ──
        inactive:
          "border-transparent bg-muted text-muted-foreground",
        neutral: "border-transparent bg-muted text-muted-foreground",
      },
    },
    defaultVariants: {
      status: "neutral",
    },
  }
);

export type StatusVariant = NonNullable<
  VariantProps<typeof statusBadgeVariants>["status"]
>;

interface StatusBadgeProps {
  status: StatusVariant | string;
  label?: string;
  className?: string;
}

/**
 * StatusBadge — colour-coded pill for entity/record statuses.
 * Uses design tokens from globals.css (success, warning, destructive, info, muted).
 * Falls back to "neutral" style for unknown status strings.
 */
export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const knownStatuses: StatusVariant[] = [
    "active", "inactive", "suspended", "pending", "approved", "rejected",
    "paid", "partial", "due", "overdue", "present", "absent", "late",
    "success", "warning", "destructive", "info", "neutral",
  ];

  const variant = knownStatuses.includes(status as StatusVariant)
    ? (status as StatusVariant)
    : "neutral";

  const displayLabel =
    label ?? status.charAt(0).toUpperCase() + status.slice(1).replace(/-/g, " ");

  return (
    <span
      data-slot="status-badge"
      data-status={status}
      className={cn(statusBadgeVariants({ status: variant }), className)}
    >
      {displayLabel}
    </span>
  );
}
