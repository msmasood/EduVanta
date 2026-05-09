import type { Notice, CalendarEvent, MessageThread, Message } from "@/types/communication";
import { formatShortDate } from "@/lib/dates";

// ─── Notice row ───────────────────────────────────────────────────────────────

export interface NoticeRow {
  id: string;
  title: string;
  category: string;
  priority: "low" | "medium" | "high" | "urgent";
  audience: string[];
  publishedAt: string;
  expiresAt?: string;
  isPinned: boolean;
  status: "draft" | "published" | "archived";
  body: string;
  createdBy: string;
}

export function mapNoticesToRows(notices: Notice[]): NoticeRow[] {
  return notices.map((n) => ({
    id: n.id,
    title: n.title,
    category: (n as Notice & { category?: string }).category ?? "General",
    priority: (n as Notice & { priority?: "low" | "medium" | "high" | "urgent" }).priority ?? "medium",
    audience: n.audience,
    publishedAt: formatShortDate(n.publishedAt),
    publishedAtRaw: n.publishedAt,
    expiresAt: n.expiresAt ? formatShortDate(n.expiresAt) : undefined,
    isPinned: n.isPinned,
    status: (n as Notice & { status?: "draft" | "published" | "archived" }).status ?? "published",
    body: n.body,
    createdBy: n.createdBy,
  }));
}

// ─── Calendar event row ───────────────────────────────────────────────────────

export interface EventRow {
  id: string;
  title: string;
  eventType: string;
  startDate: string;
  endDate: string;
  startDateRaw: string;
  endDateRaw: string;
  location: string;
  audience: string[];
  description: string;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  isAllDay: boolean;
}

export function mapEventsToRows(events: CalendarEvent[]): EventRow[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return events.map((e) => {
    const start = new Date(e.startDate);
    const end = new Date(e.endDate);
    let status: EventRow["status"] = "upcoming";
    if (start > today) status = "upcoming";
    else if (end < today) status = "completed";
    else status = "ongoing";
    return {
      id: e.id,
      title: e.title,
      eventType: e.type,
      startDate: formatShortDate(e.startDate),
      endDate: formatShortDate(e.endDate),
      startDateRaw: e.startDate,
      endDateRaw: e.endDate,
      location: e.location ?? "—",
      audience: e.audience,
      description: e.description ?? "",
      status,
      isAllDay: e.isAllDay,
    };
  });
}

// ─── Message thread row ───────────────────────────────────────────────────────

export interface ThreadRow {
  id: string;
  subject: string;
  participants: string[];
  lastMessageAt: string;
  lastMessageAtRaw: string;
  unreadCount: number;
}

export function mapThreadsToRows(threads: MessageThread[]): ThreadRow[] {
  return threads.map((t) => ({
    id: t.id,
    subject: t.subject,
    participants: t.participants,
    lastMessageAt: formatShortDate(t.lastMessageAt),
    lastMessageAtRaw: t.lastMessageAt,
    unreadCount: t.unreadCount,
  }));
}

// ─── Message row ──────────────────────────────────────────────────────────────

export interface MessageRow {
  id: string;
  threadId: string;
  senderId: string;
  body: string;
  sentAt: string;
  sentAtRaw: string;
  isRead: boolean;
  isMine: boolean;
}

export function mapMessagesToRows(
  messages: Message[],
  currentUserId: string
): MessageRow[] {
  return messages.map((m) => ({
    id: m.id,
    threadId: m.threadId,
    senderId: m.senderId,
    body: m.body,
    sentAt: formatShortDate(m.sentAt),
    sentAtRaw: m.sentAt,
    isRead: m.isRead,
    isMine: m.senderId === currentUserId,
  }));
}
