import * as React from "react";
import { cn } from "@/lib/utils";

// ─── Props ───────────────────────────────────────────────────────────────────

export interface ChartEmptyStateProps {
  message?: string;
  height?: number;
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function ChartEmptyState({
  message = "No data available",
  height = 240,
  className,
}: ChartEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground",
        className
      )}
      style={{ height }}
      role="status"
      aria-label={message}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="opacity-40"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18" />
        <path d="M9 21V9" />
      </svg>
      <p className="text-center">{message}</p>
    </div>
  );
}
