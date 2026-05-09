import * as React from "react";
import { cn } from "@/lib/utils";

// ─── Props ───────────────────────────────────────────────────────────────────

export interface DashboardSectionProps {
  title?: string;
  description?: string;
  /** Slot for a button/link at the top-right */
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function DashboardSection({
  title,
  description,
  action,
  children,
  className,
}: DashboardSectionProps) {
  return (
    <section className={cn("flex flex-col gap-4", className)}>
      {(title || description || action) && (
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex flex-col gap-0.5">
            {title && (
              <h2 className="text-base font-semibold leading-tight">{title}</h2>
            )}
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
}
