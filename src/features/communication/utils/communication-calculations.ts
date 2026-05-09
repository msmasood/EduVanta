import type { Notice, CalendarEvent, MessageThread } from "@/types/communication";

// ─── Notice stats ─────────────────────────────────────────────────────────────

export interface CommunicationNoticeStats {
  totalNotices: number;
  pinnedNotices: number;
  activeNotices: number;
  expiredNotices: number;
}

export function computeNoticeStats(notices: Notice[]): CommunicationNoticeStats {
  const now = new Date();
  return {
    totalNotices: notices.length,
    pinnedNotices: notices.filter((n) => n.isPinned).length,
    activeNotices: notices.filter(
      (n) => !n.expiresAt || new Date(n.expiresAt) > now
    ).length,
    expiredNotices: notices.filter(
      (n) => !!n.expiresAt && new Date(n.expiresAt) <= now
    ).length,
  };
}

// ─── Event stats ──────────────────────────────────────────────────────────────

export interface CommunicationEventStats {
  totalEvents: number;
  upcomingEvents: number;
  ongoingEvents: number;
  completedEvents: number;
}

export function computeEventStats(events: CalendarEvent[]): CommunicationEventStats {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return {
    totalEvents: events.length,
    upcomingEvents: events.filter((e) => new Date(e.startDate) > today).length,
    ongoingEvents: events.filter(
      (e) => new Date(e.startDate) <= today && new Date(e.endDate) >= today
    ).length,
    completedEvents: events.filter((e) => new Date(e.endDate) < today).length,
  };
}

// ─── Thread stats ─────────────────────────────────────────────────────────────

export interface CommunicationThreadStats {
  totalThreads: number;
  unreadThreads: number;
  totalUnreadMessages: number;
}

export function computeThreadStats(threads: MessageThread[]): CommunicationThreadStats {
  return {
    totalThreads: threads.length,
    unreadThreads: threads.filter((t) => t.unreadCount > 0).length,
    totalUnreadMessages: threads.reduce((sum, t) => sum + t.unreadCount, 0),
  };
}
