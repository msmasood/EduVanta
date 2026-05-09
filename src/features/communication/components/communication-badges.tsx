"use client";

import { Badge } from "@/components/ui/badge";

// ─── Notice priority badge ─────────────────────────────────────────────────────

interface NoticePriorityBadgeProps {
  priority: string;
}

const PRIORITY_CONFIG: Record<string, { label: string; className: string }> = {
  low: { label: "Low", className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
  medium: { label: "Medium", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" },
  high: { label: "High", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" },
  urgent: { label: "Urgent", className: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" },
};

export function NoticePriorityBadge({ priority }: NoticePriorityBadgeProps) {
  const config = PRIORITY_CONFIG[priority] ?? { label: priority, className: "" };
  return (
    <Badge className={config.className} data-testid="notice-priority-badge">
      {config.label}
    </Badge>
  );
}

// ─── Notice audience badge ────────────────────────────────────────────────────

interface NoticeAudienceBadgeProps {
  audience: string[];
}

export function NoticeAudienceBadge({ audience }: NoticeAudienceBadgeProps) {
  const label =
    audience.includes("all")
      ? "All"
      : audience.map((a) => a.charAt(0).toUpperCase() + a.slice(1)).join(", ");
  return (
    <Badge variant="outline" data-testid="notice-audience-badge">
      {label}
    </Badge>
  );
}

// ─── Event status badge ───────────────────────────────────────────────────────

interface EventStatusBadgeProps {
  status: string;
}

const EVENT_STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  upcoming: { label: "Upcoming", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" },
  ongoing: { label: "Ongoing", className: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" },
  completed: { label: "Completed", className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
  cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" },
};

export function EventStatusBadge({ status }: EventStatusBadgeProps) {
  const config = EVENT_STATUS_CONFIG[status] ?? { label: status, className: "" };
  return (
    <Badge className={config.className} data-testid="event-status-badge">
      {config.label}
    </Badge>
  );
}
