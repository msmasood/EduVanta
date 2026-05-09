/**
 * Notifications validation tests — Phase 20
 */

import { describe, it, expect } from "vitest";
import {
  notificationFilterSchema,
  notificationPreferenceSchema,
  notificationAlertSchema,
} from "@/lib/validations/notifications";

// ─── notificationFilterSchema ─────────────────────────────────────────────────

describe("notificationFilterSchema", () => {
  it("passes with empty filter", () => {
    const result = notificationFilterSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("passes with category filter", () => {
    const result = notificationFilterSchema.safeParse({ category: "fees" });
    expect(result.success).toBe(true);
  });

  it("passes with isRead filter", () => {
    const result = notificationFilterSchema.safeParse({ isRead: false });
    expect(result.success).toBe(true);
  });

  it("passes with search filter", () => {
    const result = notificationFilterSchema.safeParse({ search: "overdue" });
    expect(result.success).toBe(true);
  });

  it("accepts all valid categories", () => {
    for (const category of ["attendance", "fees", "exam", "leave", "notice", "message", "system"] as const) {
      const result = notificationFilterSchema.safeParse({ category });
      expect(result.success).toBe(true);
    }
  });
});

// ─── notificationPreferenceSchema ────────────────────────────────────────────

describe("notificationPreferenceSchema", () => {
  it("passes with valid channel", () => {
    const result = notificationPreferenceSchema.safeParse({
      channel: "email",
      enabled: true,
    });
    expect(result.success).toBe(true);
  });

  it("passes with all valid channels", () => {
    for (const channel of ["email", "sms", "push", "in_app"] as const) {
      const result = notificationPreferenceSchema.safeParse({ channel, enabled: true });
      expect(result.success).toBe(true);
    }
  });

  it("fails with invalid channel", () => {
    const result = notificationPreferenceSchema.safeParse({
      channel: "whatsapp",
      enabled: true,
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional category", () => {
    const result = notificationPreferenceSchema.safeParse({
      channel: "email",
      enabled: true,
      category: "fees",
    });
    expect(result.success).toBe(true);
  });

  it("accepts optional audience", () => {
    const result = notificationPreferenceSchema.safeParse({
      channel: "sms",
      enabled: false,
      audience: "students",
    });
    expect(result.success).toBe(true);
  });
});

// ─── notificationAlertSchema ──────────────────────────────────────────────────

describe("notificationAlertSchema", () => {
  it("passes with valid alert data", () => {
    const result = notificationAlertSchema.safeParse({
      channel: "email",
      categoryToggles: { fees: true, attendance: false },
      audienceToggles: { admin: true, teacher: true },
    });
    expect(result.success).toBe(true);
  });

  it("fails with invalid channel", () => {
    const result = notificationAlertSchema.safeParse({
      channel: "telegram",
      categoryToggles: {},
      audienceToggles: {},
    });
    expect(result.success).toBe(false);
  });
});
