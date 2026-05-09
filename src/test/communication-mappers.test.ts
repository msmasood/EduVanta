/**
 * Communication mappers tests — Phase 20
 */

import { describe, it, expect } from "vitest";
import {
  mapNoticesToRows,
  mapEventsToRows,
  mapThreadsToRows,
  mapMessagesToRows,
} from "@/features/communication/utils/communication-mappers";
import type { Notice, CalendarEvent, MessageThread, Message } from "@/types/communication";
import type { AuditMeta } from "@/types/common";

const audit: AuditMeta = {
  createdAt: "2024-10-01T00:00:00.000Z",
  updatedAt: "2024-10-01T00:00:00.000Z",
};

// ─── mapNoticesToRows ─────────────────────────────────────────────────────────

describe("mapNoticesToRows", () => {
  const mockNotices: Notice[] = [
    {
      id: "notice-001",
      schoolId: "school-001",
      title: "Eid Holiday",
      body: "School closed for Eid.",
      audience: ["all"],
      publishedAt: "2024-10-05T08:00:00.000Z",
      isPinned: true,
      createdBy: "emp-001",
      audit,
    },
    {
      id: "notice-002",
      schoolId: "school-001",
      title: "Exam Notice",
      body: "Mid-term exams start next week.",
      audience: ["students", "teachers"],
      publishedAt: "2024-10-03T08:00:00.000Z",
      expiresAt: "2024-10-15T00:00:00.000Z",
      isPinned: false,
      createdBy: "emp-001",
      audit,
    },
  ];

  it("maps notice id correctly", () => {
    const rows = mapNoticesToRows(mockNotices);
    expect(rows[0].id).toBe("notice-001");
  });

  it("maps isPinned correctly", () => {
    const rows = mapNoticesToRows(mockNotices);
    expect(rows[0].isPinned).toBe(true);
    expect(rows[1].isPinned).toBe(false);
  });

  it("maps audience correctly", () => {
    const rows = mapNoticesToRows(mockNotices);
    expect(rows[0].audience).toEqual(["all"]);
    expect(rows[1].audience).toEqual(["students", "teachers"]);
  });

  it("formats publishedAt as string", () => {
    const rows = mapNoticesToRows(mockNotices);
    expect(typeof rows[0].publishedAt).toBe("string");
  });

  it("maps optional expiresAt", () => {
    const rows = mapNoticesToRows(mockNotices);
    expect(rows[0].expiresAt).toBeUndefined();
    expect(typeof rows[1].expiresAt).toBe("string");
  });
});

// ─── mapEventsToRows ──────────────────────────────────────────────────────────

describe("mapEventsToRows", () => {
  const mockEvents: CalendarEvent[] = [
    {
      id: "evt-001",
      schoolId: "school-001",
      title: "Sports Day",
      type: "sport",
      startDate: "2024-11-15",
      endDate: "2024-11-15",
      isAllDay: true,
      audience: ["all"],
      createdBy: "emp-001",
      audit,
    },
  ];

  it("maps event id correctly", () => {
    const rows = mapEventsToRows(mockEvents);
    expect(rows[0].id).toBe("evt-001");
  });

  it("maps eventType from type", () => {
    const rows = mapEventsToRows(mockEvents);
    expect(rows[0].eventType).toBe("sport");
  });

  it("maps startDateRaw correctly", () => {
    const rows = mapEventsToRows(mockEvents);
    expect(rows[0].startDateRaw).toBe("2024-11-15");
  });

  it("assigns status based on date", () => {
    const rows = mapEventsToRows(mockEvents);
    expect(["upcoming", "ongoing", "completed"]).toContain(rows[0].status);
  });
});

// ─── mapThreadsToRows ─────────────────────────────────────────────────────────

describe("mapThreadsToRows", () => {
  const mockThreads: MessageThread[] = [
    {
      id: "thread-001",
      schoolId: "school-001",
      participants: ["teacher-001", "guardian-001"],
      subject: "Ahmed's performance",
      lastMessageAt: "2024-10-03T14:30:00.000Z",
      unreadCount: 1,
      audit,
    },
  ];

  it("maps thread id correctly", () => {
    const rows = mapThreadsToRows(mockThreads);
    expect(rows[0].id).toBe("thread-001");
  });

  it("maps unreadCount correctly", () => {
    const rows = mapThreadsToRows(mockThreads);
    expect(rows[0].unreadCount).toBe(1);
  });

  it("maps participants correctly", () => {
    const rows = mapThreadsToRows(mockThreads);
    expect(rows[0].participants).toEqual(["teacher-001", "guardian-001"]);
  });
});

// ─── mapMessagesToRows ────────────────────────────────────────────────────────

describe("mapMessagesToRows", () => {
  const mockMessages: Message[] = [
    {
      id: "msg-001",
      threadId: "thread-001",
      senderId: "teacher-001",
      body: "Hello!",
      sentAt: "2024-10-01T10:00:00.000Z",
      isRead: true,
      audit,
    },
    {
      id: "msg-002",
      threadId: "thread-001",
      senderId: "guardian-001",
      body: "Thank you!",
      sentAt: "2024-10-02T10:00:00.000Z",
      isRead: false,
      audit,
    },
  ];

  it("maps isMine correctly for current user", () => {
    const rows = mapMessagesToRows(mockMessages, "teacher-001");
    expect(rows[0].isMine).toBe(true);
    expect(rows[1].isMine).toBe(false);
  });

  it("maps isRead correctly", () => {
    const rows = mapMessagesToRows(mockMessages, "teacher-001");
    expect(rows[0].isRead).toBe(true);
    expect(rows[1].isRead).toBe(false);
  });

  it("maps threadId correctly", () => {
    const rows = mapMessagesToRows(mockMessages, "teacher-001");
    expect(rows[0].threadId).toBe("thread-001");
  });
});
