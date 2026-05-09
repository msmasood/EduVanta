import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface QuickAction {
  label: string;
  description?: string;
  icon: React.ReactNode;
  href: string;
  disabled?: boolean;
}

export interface QuickActionGridProps {
  actions: QuickAction[];
  columns?: 2 | 3 | 4;
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

const columnClasses: Record<2 | 3 | 4, string> = {
  2: "grid-cols-2",
  3: "grid-cols-2 sm:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-4",
};

export function QuickActionGrid({
  actions,
  columns = 4,
  className,
}: QuickActionGridProps) {
  return (
    <div
      className={cn("grid gap-3", columnClasses[columns], className)}
      role="list"
      aria-label="Quick actions"
    >
      {actions.map((action) => (
        <QuickActionItem key={action.href} action={action} />
      ))}
    </div>
  );
}

function QuickActionItem({ action }: { action: QuickAction }) {
  const inner = (
    <div className="flex flex-col items-center gap-2 p-3 text-center">
      <span
        className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
        aria-hidden="true"
      >
        {action.icon}
      </span>
      <div>
        <p className="text-xs font-medium leading-tight">{action.label}</p>
        {action.description && (
          <p className="mt-0.5 text-[10px] text-muted-foreground leading-tight">
            {action.description}
          </p>
        )}
      </div>
    </div>
  );

  if (action.disabled) {
    return (
      <div
        role="listitem"
        className="group rounded-xl border border-border bg-muted/50 opacity-50 cursor-not-allowed"
        aria-disabled="true"
        aria-label={action.label}
      >
        {inner}
      </div>
    );
  }

  return (
    <Link
      href={action.href}
      role="listitem"
      className="group rounded-xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={action.label}
    >
      {inner}
    </Link>
  );
}
