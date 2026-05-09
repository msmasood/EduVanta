import type { ID, AuditMeta } from "./common";

// ─── Notice ───────────────────────────────────────────────────────────────────

export type NoticeAudience = "all" | "students" | "teachers" | "employees" | "parents" | "guardians";

export interface Notice {
  id: ID;
  schoolId: ID;
  title: string;
  body: string;
  audience: NoticeAudience[];
  publishedAt: string;
  expiresAt?: string;
  isPinned: boolean;
  createdBy: ID;
  audit: AuditMeta;
}

// ─── Calendar event ───────────────────────────────────────────────────────────

export type EventType = "academic" | "holiday" | "exam" | "meeting" | "sport" | "cultural" | "other";

export interface CalendarEvent {
  id: ID;
  schoolId: ID;
  title: string;
  description?: string;
  type: EventType;
  startDate: string;
  endDate: string;
  isAllDay: boolean;
  location?: string;
  audience: NoticeAudience[];
  createdBy: ID;
  audit: AuditMeta;
}

// ─── Message ──────────────────────────────────────────────────────────────────

export interface MessageThread {
  id: ID;
  schoolId: ID;
  participants: ID[];
  subject: string;
  lastMessageAt: string;
  unreadCount: number;
  audit: AuditMeta;
}

export interface Message {
  id: ID;
  threadId: ID;
  senderId: ID;
  body: string;
  sentAt: string;
  isRead: boolean;
  audit: AuditMeta;
}
