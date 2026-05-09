"use client";

import { SearchX } from "lucide-react";

import { cn } from "@/lib/utils";

interface EmptyTableStateProps {
  title?: string;
  description?: string;
  className?: string;
}

/**
 * EmptyTableState — shown inside the DataTable when the filtered result set
 * is empty (no data, or all rows filtered out).
 */
export function EmptyTableState({
  title = "No results found",
  description = "Try adjusting your search or filters.",
  className,
}: EmptyTableStateProps) {
  return (
    <div
      data-slot="empty-table-state"
      className={cn(
        "flex flex-col items-center justify-center gap-2 py-16 text-center",
        className
      )}
    >
      <SearchX
        className="size-10 text-muted-foreground/50"
        aria-hidden
      />
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
