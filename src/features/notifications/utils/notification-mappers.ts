import type { Notification } from "@/types/notifications";
import { formatShortDate } from "@/lib/dates";

// ─── Notification row ─────────────────────────────────────────────────────────

export interface NotificationRow {
  id: string;
  category: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  createdAtRaw: string;
  readAt?: string;
  referenceId?: string;
  referenceType?: string;
}

export function mapNotificationsToRows(notifications: Notification[]): NotificationRow[] {
  return notifications.map((n) => ({
    id: n.id,
    category: n.category,
    title: n.title,
    body: n.body,
    isRead: n.isRead,
    createdAt: formatShortDate(n.createdAt),
    createdAtRaw: n.createdAt,
    readAt: n.readAt ? formatShortDate(n.readAt) : undefined,
    referenceId: n.referenceId,
    referenceType: n.referenceType,
  }));
}

// ─── Notification preference row ──────────────────────────────────────────────

export interface NotificationPreferenceRow {
  id: string;
  channel: "email" | "sms" | "push" | "in_app";
  channelLabel: string;
  categoryToggles: Record<string, boolean>;
  audienceToggles: Record<string, boolean>;
}

const CHANNEL_LABELS: Record<string, string> = {
  email: "Email",
  sms: "SMS",
  push: "Push Notifications",
  in_app: "In-App Notifications",
};

export function buildDefaultPreferenceRows(): NotificationPreferenceRow[] {
  const channels = ["email", "sms", "push", "in_app"] as const;
  const categories = ["fees", "attendance", "exam", "leave", "notice", "message", "system"];
  const audiences = ["admin", "teacher", "student", "parent"];

  return channels.map((channel) => ({
    id: channel,
    channel,
    channelLabel: CHANNEL_LABELS[channel] ?? channel,
    categoryToggles: Object.fromEntries(categories.map((c) => [c, true])),
    audienceToggles: Object.fromEntries(audiences.map((a) => [a, true])),
  }));
}
