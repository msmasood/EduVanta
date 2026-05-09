"use client";

import { Bell, Pin, CheckCircle, Clock, Calendar, MessageSquare, Inbox } from "lucide-react";
import type {
  CommunicationNoticeStats,
  CommunicationEventStats,
  CommunicationThreadStats,
} from "../utils/communication-calculations";

interface SummaryCardItem {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  bg: string;
}

function SummaryCard({ label, value, icon: Icon, color, bg }: SummaryCardItem) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`rounded-lg p-2 ${bg}`}>
          <Icon className={`size-5 ${color}`} />
        </div>
        <div>
          <p className="text-2xl font-bold tabular-nums">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Notice summary cards ─────────────────────────────────────────────────────

interface NoticeSummaryCardsProps {
  stats: CommunicationNoticeStats;
}

export function NoticeSummaryCards({ stats }: NoticeSummaryCardsProps) {
  const cards: SummaryCardItem[] = [
    { label: "Total Notices", value: stats.totalNotices, icon: Bell, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/30" },
    { label: "Pinned", value: stats.pinnedNotices, icon: Pin, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/30" },
    { label: "Active", value: stats.activeNotices, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50 dark:bg-green-950/30" },
    { label: "Expired", value: stats.expiredNotices, icon: Clock, color: "text-red-600", bg: "bg-red-50 dark:bg-red-950/30" },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4" data-testid="notice-summary-cards">
      {cards.map((c) => (
        <SummaryCard key={c.label} {...c} />
      ))}
    </div>
  );
}

// ─── Event summary cards ──────────────────────────────────────────────────────

interface EventSummaryCardsProps {
  stats: CommunicationEventStats;
}

export function EventSummaryCards({ stats }: EventSummaryCardsProps) {
  const cards: SummaryCardItem[] = [
    { label: "Total Events", value: stats.totalEvents, icon: Calendar, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-950/30" },
    { label: "Upcoming", value: stats.upcomingEvents, icon: Clock, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/30" },
    { label: "Ongoing", value: stats.ongoingEvents, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50 dark:bg-green-950/30" },
    { label: "Completed", value: stats.completedEvents, icon: CheckCircle, color: "text-muted-foreground", bg: "bg-muted" },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4" data-testid="event-summary-cards">
      {cards.map((c) => (
        <SummaryCard key={c.label} {...c} />
      ))}
    </div>
  );
}

// ─── Message summary cards ────────────────────────────────────────────────────

interface MessageSummaryCardsProps {
  stats: CommunicationThreadStats;
}

export function MessageSummaryCards({ stats }: MessageSummaryCardsProps) {
  const cards: SummaryCardItem[] = [
    { label: "Total Threads", value: stats.totalThreads, icon: MessageSquare, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/30" },
    { label: "Unread Threads", value: stats.unreadThreads, icon: Inbox, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/30" },
    { label: "Unread Messages", value: stats.totalUnreadMessages, icon: Bell, color: "text-red-600", bg: "bg-red-50 dark:bg-red-950/30" },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3" data-testid="message-summary-cards">
      {cards.map((c) => (
        <SummaryCard key={c.label} {...c} />
      ))}
    </div>
  );
}
