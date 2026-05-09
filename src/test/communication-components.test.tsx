/**
 * Communication component tests — Phase 20
 */

import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeAll } from "vitest";

import { NoticeSummaryCards, EventSummaryCards, MessageSummaryCards } from "@/features/communication/components/communication-summary-cards";
import { NoticePriorityBadge, NoticeAudienceBadge, EventStatusBadge } from "@/features/communication/components/communication-badges";
import { NoticeCardGrid } from "@/features/communication/components/notice-card-grid";
import { EventList } from "@/features/communication/components/event-list";
import { MessageConversation } from "@/features/communication/components/message-conversation";
import { MessageThreadList } from "@/features/communication/components/message-thread-list";
import type { CommunicationNoticeStats, CommunicationEventStats, CommunicationThreadStats } from "@/features/communication/utils/communication-calculations";
import type { NoticeRow, EventRow, MessageRow, ThreadRow } from "@/features/communication/utils/communication-mappers";

// ─── NoticeSummaryCards ───────────────────────────────────────────────────────

describe("NoticeSummaryCards", () => {
  const stats: CommunicationNoticeStats = {
    totalNotices: 10,
    pinnedNotices: 2,
    activeNotices: 8,
    expiredNotices: 2,
  };

  it("renders notice-summary-cards testid", () => {
    render(<NoticeSummaryCards stats={stats} />);
    expect(screen.getByTestId("notice-summary-cards")).toBeDefined();
  });

  it("shows total notices count", () => {
    render(<NoticeSummaryCards stats={stats} />);
    expect(screen.getByText("10")).toBeDefined();
  });

  it("shows pinned notices count", () => {
    render(<NoticeSummaryCards stats={stats} />);
    expect(screen.getAllByText("2").length).toBeGreaterThan(0);
  });
});

// ─── EventSummaryCards ────────────────────────────────────────────────────────

describe("EventSummaryCards", () => {
  const stats: CommunicationEventStats = {
    totalEvents: 5,
    upcomingEvents: 3,
    ongoingEvents: 1,
    completedEvents: 1,
  };

  it("renders event-summary-cards testid", () => {
    render(<EventSummaryCards stats={stats} />);
    expect(screen.getByTestId("event-summary-cards")).toBeDefined();
  });

  it("shows total events count", () => {
    render(<EventSummaryCards stats={stats} />);
    expect(screen.getByText("5")).toBeDefined();
  });
});

// ─── MessageSummaryCards ──────────────────────────────────────────────────────

describe("MessageSummaryCards", () => {
  const stats: CommunicationThreadStats = {
    totalThreads: 4,
    unreadThreads: 2,
    totalUnreadMessages: 3,
  };

  it("renders message-summary-cards testid", () => {
    render(<MessageSummaryCards stats={stats} />);
    expect(screen.getByTestId("message-summary-cards")).toBeDefined();
  });

  it("shows total threads count", () => {
    render(<MessageSummaryCards stats={stats} />);
    expect(screen.getByText("4")).toBeDefined();
  });
});

// ─── NoticePriorityBadge ──────────────────────────────────────────────────────

describe("NoticePriorityBadge", () => {
  it("renders Low for low priority", () => {
    render(<NoticePriorityBadge priority="low" />);
    expect(screen.getByText("Low")).toBeDefined();
  });

  it("renders Urgent for urgent priority", () => {
    render(<NoticePriorityBadge priority="urgent" />);
    expect(screen.getByText("Urgent")).toBeDefined();
  });

  it("renders notice-priority-badge testid", () => {
    render(<NoticePriorityBadge priority="medium" />);
    expect(screen.getByTestId("notice-priority-badge")).toBeDefined();
  });
});

// ─── NoticeAudienceBadge ──────────────────────────────────────────────────────

describe("NoticeAudienceBadge", () => {
  it('renders "All" when audience includes all', () => {
    render(<NoticeAudienceBadge audience={["all"]} />);
    expect(screen.getByText("All")).toBeDefined();
  });

  it("renders capitalized audience list", () => {
    render(<NoticeAudienceBadge audience={["students", "teachers"]} />);
    expect(screen.getByText("Students, Teachers")).toBeDefined();
  });

  it("renders notice-audience-badge testid", () => {
    render(<NoticeAudienceBadge audience={["all"]} />);
    expect(screen.getByTestId("notice-audience-badge")).toBeDefined();
  });
});

// ─── EventStatusBadge ─────────────────────────────────────────────────────────

describe("EventStatusBadge", () => {
  it("renders Upcoming for upcoming status", () => {
    render(<EventStatusBadge status="upcoming" />);
    expect(screen.getByText("Upcoming")).toBeDefined();
  });

  it("renders Completed for completed status", () => {
    render(<EventStatusBadge status="completed" />);
    expect(screen.getByText("Completed")).toBeDefined();
  });

  it("renders event-status-badge testid", () => {
    render(<EventStatusBadge status="ongoing" />);
    expect(screen.getByTestId("event-status-badge")).toBeDefined();
  });
});

// ─── NoticeCardGrid ───────────────────────────────────────────────────────────

describe("NoticeCardGrid", () => {
  const notices: NoticeRow[] = [
    {
      id: "n-001",
      title: "Test Notice",
      category: "General",
      priority: "medium",
      audience: ["all"],
      publishedAt: "Oct 5, 2024",
      isPinned: false,
      status: "published",
      body: "This is a test notice body.",
      createdBy: "emp-001",
    },
  ];

  it("renders notice-card-grid testid", () => {
    render(<NoticeCardGrid notices={notices} onEdit={() => {}} onDelete={() => {}} />);
    expect(screen.getByTestId("notice-card-grid")).toBeDefined();
  });

  it("renders notice title", () => {
    render(<NoticeCardGrid notices={notices} onEdit={() => {}} onDelete={() => {}} />);
    expect(screen.getByText("Test Notice")).toBeDefined();
  });

  it("renders empty state when no notices", () => {
    render(<NoticeCardGrid notices={[]} onEdit={() => {}} onDelete={() => {}} />);
    expect(screen.getByTestId("notice-card-grid-empty")).toBeDefined();
  });
});

// ─── EventList ────────────────────────────────────────────────────────────────

describe("EventList", () => {
  const events: EventRow[] = [
    {
      id: "e-001",
      title: "Sports Day",
      eventType: "sport",
      startDate: "Nov 15, 2024",
      endDate: "Nov 15, 2024",
      startDateRaw: "2024-11-15",
      endDateRaw: "2024-11-15",
      location: "School Grounds",
      audience: ["all"],
      description: "",
      status: "upcoming",
      isAllDay: true,
    },
  ];

  it("renders event-list testid", () => {
    render(<EventList events={events} onView={() => {}} onEdit={() => {}} onDelete={() => {}} />);
    expect(screen.getByTestId("event-list")).toBeDefined();
  });

  it("renders event title", () => {
    render(<EventList events={events} onView={() => {}} onEdit={() => {}} onDelete={() => {}} />);
    expect(screen.getByText("Sports Day")).toBeDefined();
  });

  it("renders empty state when no events", () => {
    render(<EventList events={[]} onView={() => {}} onEdit={() => {}} onDelete={() => {}} />);
    expect(screen.getByTestId("event-list-empty")).toBeDefined();
  });
});

// ─── MessageConversation ──────────────────────────────────────────────────────

describe("MessageConversation", () => {
  beforeAll(() => {
    window.HTMLElement.prototype.scrollIntoView = () => {};
  });

  const messages: MessageRow[] = [
    {
      id: "msg-001",
      threadId: "thread-001",
      senderId: "teacher-001",
      body: "Hello student!",
      sentAt: "Oct 1, 2024",
      sentAtRaw: "2024-10-01T10:00:00.000Z",
      isRead: true,
      isMine: true,
    },
  ];

  it("renders message-conversation testid", () => {
    render(<MessageConversation messages={messages} currentUserId="teacher-001" />);
    expect(screen.getByTestId("message-conversation")).toBeDefined();
  });

  it("renders message body", () => {
    render(<MessageConversation messages={messages} currentUserId="teacher-001" />);
    expect(screen.getByText("Hello student!")).toBeDefined();
  });

  it("renders empty state when no messages", () => {
    render(<MessageConversation messages={[]} currentUserId="teacher-001" />);
    expect(screen.getByTestId("conversation-empty")).toBeDefined();
  });
});

// ─── MessageThreadList ────────────────────────────────────────────────────────

describe("MessageThreadList", () => {
  const threads: ThreadRow[] = [
    {
      id: "thread-001",
      subject: "Math homework",
      participants: ["teacher-001", "guardian-001"],
      lastMessageAt: "Oct 3, 2024",
      lastMessageAtRaw: "2024-10-03T14:30:00.000Z",
      unreadCount: 1,
    },
  ];

  it("renders message-thread-list testid", () => {
    render(<MessageThreadList threads={threads} onSelectThread={() => {}} />);
    expect(screen.getByTestId("message-thread-list")).toBeDefined();
  });

  it("renders thread subject", () => {
    render(<MessageThreadList threads={threads} onSelectThread={() => {}} />);
    expect(screen.getByText("Math homework")).toBeDefined();
  });

  it("renders empty state when no threads", () => {
    render(<MessageThreadList threads={[]} onSelectThread={() => {}} />);
    expect(screen.getByTestId("thread-list-empty")).toBeDefined();
  });
});
