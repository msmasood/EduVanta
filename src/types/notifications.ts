import type { ID, AuditMeta } from "./common";

// ─── Notification ─────────────────────────────────────────────────────────────

export type NotificationCategory = "attendance" | "fees" | "exam" | "leave" | "notice" | "message" | "system";

export interface Notification {
  id: ID;
  schoolId: ID;
  recipientId: ID;
  category: NotificationCategory;
  title: string;
  body: string;
  referenceId?: ID;
  referenceType?: string;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
}

// ─── Notification preference ──────────────────────────────────────────────────

export interface NotificationPreference {
  userId: ID;
  category: NotificationCategory;
  emailEnabled: boolean;
  smsEnabled: boolean;
  inAppEnabled: boolean;
  audit: AuditMeta;
}
