"use client";

import * as React from "react";
import { TableSkeleton } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNotifications } from "@/hooks/queries/use-notifications";
import { mapNotificationsToRows, type NotificationRow } from "../utils/notification-mappers";
import { NotificationCardList } from "./notification-card-list";
import { NotificationSummaryCards } from "./notification-summary-cards";

const CURRENT_USER = "guardian-001";

export function NotificationsManager() {
  const notificationsQuery = useNotifications(CURRENT_USER);
  const [localNotifications, setLocalNotifications] = React.useState<NotificationRow[]>([]);

  const rawNotifications = notificationsQuery.data?.data ?? [];

  React.useEffect(() => {
    if (!notificationsQuery.isLoading) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalNotifications(mapNotificationsToRows(rawNotifications));
    }
  }, [notificationsQuery.isLoading, rawNotifications]);

  const stats = React.useMemo(() => {
    const total = localNotifications.length;
    const unread = localNotifications.filter((n) => !n.isRead).length;
    const read = total - unread;
    const urgent = localNotifications.filter((n) => n.category === "system").length;
    return { total, unread, read, urgent };
  }, [localNotifications]);

  const handleMarkRead = (id: string) => {
    setLocalNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    toast.success("Notification marked as read.");
  };

  const handleDismiss = (id: string) => {
    setLocalNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.info("Notification dismissed.");
  };

  const handleMarkAllRead = () => {
    setLocalNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast.success("All notifications marked as read.");
  };

  if (notificationsQuery.isLoading) {
    return (
      <div data-testid="notifications-manager">
        <TableSkeleton columns={4} rows={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="notifications-manager">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Notifications</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View and manage your recent notifications.
          </p>
        </div>
        {stats.unread > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllRead}
            data-testid="mark-all-read-btn"
          >
            Mark All Read
          </Button>
        )}
      </div>

      <NotificationSummaryCards {...stats} />

      <NotificationCardList
        notifications={localNotifications}
        onMarkRead={handleMarkRead}
        onDismiss={handleDismiss}
      />
    </div>
  );
}
