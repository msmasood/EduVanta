import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRelativeDate } from "@/lib/dates";

// ─── Types ───────────────────────────────────────────────────────────────────

export type ActivityType =
  | "enrollment"
  | "payment"
  | "attendance"
  | "grade"
  | "message"
  | "notice"
  | "system"
  | string;

export interface ActivityItem {
  id: string;
  title: string;
  description?: string;
  activityType: ActivityType;
  timestamp: string;
  /** Avatar/icon element */
  icon?: React.ReactNode;
  /** Whether this item is unread */
  isUnread?: boolean;
}

export interface RecentActivityListProps {
  activities?: ActivityItem[];
  title?: string;
  /** "View all" action slot */
  action?: React.ReactNode;
  loading?: boolean;
  empty?: boolean;
  emptyMessage?: string;
  /** Max items to render (default 8) */
  maxItems?: number;
  locale?: string;
  className?: string;
}

// ─── Activity type icon colors ────────────────────────────────────────────────

const activityTypeDotClass: Record<string, string> = {
  enrollment: "bg-[var(--chart-1)]",
  payment: "bg-[var(--success)]",
  attendance: "bg-[var(--chart-2)]",
  grade: "bg-[var(--chart-3)]",
  message: "bg-[var(--info)]",
  notice: "bg-[var(--warning)]",
  system: "bg-muted-foreground",
};

function getDotClass(type: ActivityType): string {
  return activityTypeDotClass[type] ?? "bg-muted-foreground";
}

// ─── Component ───────────────────────────────────────────────────────────────

export function RecentActivityList({
  activities = [],
  title = "Recent Activity",
  action,
  loading = false,
  empty = false,
  emptyMessage = "No recent activity",
  maxItems = 8,
  locale = "en",
  className,
}: RecentActivityListProps) {
  const visible = activities.slice(0, maxItems);

  return (
    <Card className={cn("gap-3", className)}>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {action && <CardAction>{action}</CardAction>}
      </CardHeader>

      <CardContent className="pb-2">
        {loading ? (
          <div className="flex flex-col gap-3" aria-busy="true">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="mt-1 h-2 w-2 shrink-0 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-3.5 w-3/4 rounded" />
                  <Skeleton className="h-3 w-1/2 rounded" />
                </div>
                <Skeleton className="h-3 w-12 rounded" />
              </div>
            ))}
          </div>
        ) : empty || visible.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground" role="status">
            {emptyMessage}
          </p>
        ) : (
          <ol className="flex flex-col gap-0 divide-y divide-border/50">
            {visible.map((item) => (
              <li
                key={item.id}
                className={cn(
                  "flex items-start gap-3 py-2.5",
                  item.isUnread && "font-medium"
                )}
              >
                {/* Dot / custom icon */}
                <span className="mt-2 shrink-0" aria-hidden="true">
                  {item.icon ?? (
                    <span
                      className={cn(
                        "inline-block h-2 w-2 rounded-full",
                        getDotClass(item.activityType)
                      )}
                    />
                  )}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm leading-snug">{item.title}</p>
                  {item.description && (
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  )}
                </div>

                <time
                  dateTime={item.timestamp}
                  className="shrink-0 whitespace-nowrap text-xs text-muted-foreground"
                >
                  {formatRelativeDate(item.timestamp, locale)}
                </time>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
