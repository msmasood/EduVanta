"use client";

import { cn } from "@/lib/utils";
import { NotificationStatusBadge, NotificationCategoryBadge } from "./notification-status-badge";
import type { NotificationRow } from "../utils/notification-mappers";

interface NotificationCardListProps {
  notifications: NotificationRow[];
  onMarkRead: (id: string) => void;
  onDismiss: (id: string) => void;
}

export function NotificationCardList({
  notifications,
  onMarkRead,
  onDismiss,
}: NotificationCardListProps) {
  if (notifications.length === 0) {
    return (
      <div className="py-12 text-center" data-testid="notification-card-list-empty">
        <p className="text-muted-foreground">No notifications found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2" data-testid="notification-card-list">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={cn(
            "flex items-start gap-3 rounded-xl border bg-card p-4 shadow-sm",
            !n.isRead && "border-blue-200 dark:border-blue-800"
          )}
          data-testid="notification-card"
        >
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <NotificationCategoryBadge category={n.category} />
              <NotificationStatusBadge isRead={n.isRead} />
            </div>
            <p className="font-medium text-sm">{n.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.body}</p>
            <p className="text-xs text-muted-foreground mt-1">{n.createdAt}</p>
          </div>
          <div className="flex flex-col gap-1 shrink-0">
            {!n.isRead && (
              <button
                className="text-xs text-primary hover:underline"
                onClick={() => onMarkRead(n.id)}
                data-testid="mark-read-btn"
              >
                Mark read
              </button>
            )}
            <button
              className="text-xs text-destructive hover:underline"
              onClick={() => onDismiss(n.id)}
              data-testid="dismiss-btn"
            >
              Dismiss
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
