import * as React from "react";
import { cn } from "@/lib/utils";

// ─── Props ───────────────────────────────────────────────────────────────────

export interface DashboardEmptyStateProps {
  title?: string;
  description?: string;
  /** Optional action element (e.g. a button) */
  action?: React.ReactNode;
  /** Override the icon */
  icon?: React.ReactNode;
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

const DefaultIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-muted-foreground opacity-40"
    aria-hidden="true"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export function DashboardEmptyState({
  title = "No data available",
  description,
  action,
  icon,
  className,
}: DashboardEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted/30 p-10 text-center",
        className
      )}
      role="status"
      aria-label={title}
    >
      {icon ?? <DefaultIcon />}
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium">{title}</p>
        {description && (
          <p className="max-w-xs text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
