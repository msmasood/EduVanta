/**
 * Communication validation tests — Phase 20
 */

import { describe, it, expect } from "vitest";
import {
  noticeFormSchema,
  eventFormSchema,
  messageFormSchema,
  messageThreadFilterSchema,
} from "@/lib/validations/communication";

// ─── noticeFormSchema ─────────────────────────────────────────────────────────

describe("noticeFormSchema", () => {
  it("passes with valid notice data", () => {
    const result = noticeFormSchema.safeParse({
      title: "School Holiday",
      category: "Holiday",
      priority: "high",
      audience: ["all"],
      publishDate: "2024-11-01",
      body: "School will be closed on November 1.",
      pinned: false,
      status: "published",
    });
    expect(result.success).toBe(true);
  });

  it("fails when title is too short", () => {
    const result = noticeFormSchema.safeParse({
      title: "Hi",
      category: "General",
      priority: "medium",
      audience: ["all"],
      publishDate: "2024-11-01",
      body: "This is a valid body that is long enough.",
      pinned: false,
      status: "published",
    });
    expect(result.success).toBe(false);
  });

  it("fails when audience is empty", () => {
    const result = noticeFormSchema.safeParse({
      title: "Valid Title",
      category: "General",
      priority: "medium",
      audience: [],
      publishDate: "2024-11-01",
      body: "This is a valid body that is long enough.",
      pinned: false,
      status: "published",
    });
    expect(result.success).toBe(false);
  });

  it("fails when body is too short", () => {
    const result = noticeFormSchema.safeParse({
      title: "Valid Title",
      category: "General",
      priority: "medium",
      audience: ["all"],
      publishDate: "2024-11-01",
      body: "Short",
      pinned: false,
      status: "published",
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional expiryDate", () => {
    const result = noticeFormSchema.safeParse({
      title: "Valid Title",
      category: "General",
      priority: "medium",
      audience: ["all"],
      publishDate: "2024-11-01",
      expiryDate: "2024-11-30",
      body: "This is a valid body that is long enough.",
      pinned: false,
      status: "published",
    });
    expect(result.success).toBe(true);
  });

  it("accepts all valid priority values", () => {
    for (const priority of ["low", "medium", "high", "urgent"] as const) {
      const result = noticeFormSchema.safeParse({
        title: "Valid Title",
        category: "General",
        priority,
        audience: ["all"],
        publishDate: "2024-11-01",
        body: "This is a valid body that is long enough.",
        pinned: false,
        status: "published",
      });
      expect(result.success).toBe(true);
    }
  });
});

// ─── eventFormSchema ──────────────────────────────────────────────────────────

describe("eventFormSchema", () => {
  it("passes with valid event data", () => {
    const result = eventFormSchema.safeParse({
      title: "Annual Sports Day",
      eventType: "sport",
      startDate: "2024-11-15",
      audience: ["all"],
      status: "upcoming",
    });
    expect(result.success).toBe(true);
  });

  it("fails when title is too short", () => {
    const result = eventFormSchema.safeParse({
      title: "Hi",
      eventType: "sport",
      startDate: "2024-11-15",
      audience: ["all"],
      status: "upcoming",
    });
    expect(result.success).toBe(false);
  });

  it("fails when audience is empty", () => {
    const result = eventFormSchema.safeParse({
      title: "Annual Sports Day",
      eventType: "sport",
      startDate: "2024-11-15",
      audience: [],
      status: "upcoming",
    });
    expect(result.success).toBe(false);
  });

  it("fails when end date is before start date", () => {
    const result = eventFormSchema.safeParse({
      title: "Annual Sports Day",
      eventType: "sport",
      startDate: "2024-11-15",
      endDate: "2024-11-10",
      audience: ["all"],
      status: "upcoming",
    });
    expect(result.success).toBe(false);
  });

  it("accepts all valid event types", () => {
    for (const eventType of ["academic", "holiday", "exam", "meeting", "sport", "cultural", "other"] as const) {
      const result = eventFormSchema.safeParse({
        title: "Event Title",
        eventType,
        startDate: "2024-11-15",
        audience: ["all"],
        status: "upcoming",
      });
      expect(result.success).toBe(true);
    }
  });
});

// ─── messageFormSchema ────────────────────────────────────────────────────────

describe("messageFormSchema", () => {
  it("passes with valid message data", () => {
    const result = messageFormSchema.safeParse({
      recipientIds: ["teacher-001"],
      body: "Hello teacher!",
    });
    expect(result.success).toBe(true);
  });

  it("fails when recipientIds is empty", () => {
    const result = messageFormSchema.safeParse({
      recipientIds: [],
      body: "Hello teacher!",
    });
    expect(result.success).toBe(false);
  });

  it("fails when body is empty", () => {
    const result = messageFormSchema.safeParse({
      recipientIds: ["teacher-001"],
      body: "",
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional threadId and subject", () => {
    const result = messageFormSchema.safeParse({
      threadId: "thread-001",
      recipientIds: ["teacher-001"],
      subject: "Math homework",
      body: "Can you help me with question 5?",
    });
    expect(result.success).toBe(true);
  });
});

// ─── messageThreadFilterSchema ────────────────────────────────────────────────

describe("messageThreadFilterSchema", () => {
  it("passes with empty filter", () => {
    const result = messageThreadFilterSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("passes with search filter", () => {
    const result = messageThreadFilterSchema.safeParse({ search: "math" });
    expect(result.success).toBe(true);
  });
});
