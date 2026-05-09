"use client";

import { Badge } from "@/components/ui/badge";

// ─── Notification status badge ────────────────────────────────────────────────

interface NotificationStatusBadgeProps {
  isRead: boolean;
}

export function NotificationStatusBadge({ isRead }: NotificationStatusBadgeProps) {
  if (isRead) {
    return (
      <Badge variant="outline" className="text-muted-foreground" data-testid="notification-status-badge">
        Read
      </Badge>
    );
  }
  return (
    <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" data-testid="notification-status-badge">
      Unread
    </Badge>
  );
}

// ─── Notification category badge ─────────────────────────────────────────────

interface NotificationCategoryBadgeProps {
  category: string;
}

const CATEGORY_CONFIG: Record<string, { label: string; className: string }> = {
  fees: { label: "Fees", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" },
  attendance: { label: "Attendance", className: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" },
  exam: { label: "Exam", className: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300" },
  leave: { label: "Leave", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" },
  notice: { label: "Notice", className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
  message: { label: "Message", className: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300" },
  system: { label: "System", className: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" },
};

export function NotificationCategoryBadge({ category }: NotificationCategoryBadgeProps) {
  const config = CATEGORY_CONFIG[category] ?? { label: category, className: "" };
  return (
    <Badge className={config.className} data-testid="notification-category-badge">
      {config.label}
    </Badge>
  );
}
