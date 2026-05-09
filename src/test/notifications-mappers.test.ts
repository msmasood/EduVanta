/**
 * Notifications mappers tests — Phase 20
 */

import { describe, it, expect } from "vitest";
import {
  mapNotificationsToRows,
  buildDefaultPreferenceRows,
} from "@/features/notifications/utils/notification-mappers";
import type { Notification } from "@/types/notifications";

// ─── mapNotificationsToRows ───────────────────────────────────────────────────

describe("mapNotificationsToRows", () => {
  const mockNotifications: Notification[] = [
    {
      id: "notif-001",
      schoolId: "school-001",
      recipientId: "guardian-001",
      category: "fees",
      title: "Fee Overdue",
      body: "October 2024 fee is overdue.",
      referenceId: "inv-003",
      referenceType: "FeeInvoice",
      isRead: false,
      createdAt: "2024-10-11T08:00:00.000Z",
    },
    {
      id: "notif-002",
      schoolId: "school-001",
      recipientId: "guardian-001",
      category: "attendance",
      title: "Attendance Alert",
      body: "Attendance dropped below 75%.",
      isRead: true,
      createdAt: "2024-10-05T09:00:00.000Z",
      readAt: "2024-10-05T11:00:00.000Z",
    },
  ];

  it("maps notification id correctly", () => {
    const rows = mapNotificationsToRows(mockNotifications);
    expect(rows[0].id).toBe("notif-001");
  });

  it("maps category correctly", () => {
    const rows = mapNotificationsToRows(mockNotifications);
    expect(rows[0].category).toBe("fees");
    expect(rows[1].category).toBe("attendance");
  });

  it("maps isRead correctly", () => {
    const rows = mapNotificationsToRows(mockNotifications);
    expect(rows[0].isRead).toBe(false);
    expect(rows[1].isRead).toBe(true);
  });

  it("maps createdAt as formatted string", () => {
    const rows = mapNotificationsToRows(mockNotifications);
    expect(typeof rows[0].createdAt).toBe("string");
    expect(rows[0].createdAt.length).toBeGreaterThan(0);
  });

  it("maps readAt for read notifications", () => {
    const rows = mapNotificationsToRows(mockNotifications);
    expect(rows[0].readAt).toBeUndefined();
    expect(typeof rows[1].readAt).toBe("string");
  });

  it("maps referenceId and referenceType", () => {
    const rows = mapNotificationsToRows(mockNotifications);
    expect(rows[0].referenceId).toBe("inv-003");
    expect(rows[0].referenceType).toBe("FeeInvoice");
  });

  it("maps title and body correctly", () => {
    const rows = mapNotificationsToRows(mockNotifications);
    expect(rows[0].title).toBe("Fee Overdue");
    expect(rows[0].body).toBe("October 2024 fee is overdue.");
  });
});

// ─── buildDefaultPreferenceRows ───────────────────────────────────────────────

describe("buildDefaultPreferenceRows", () => {
  it("returns 4 preference rows (email, sms, push, in_app)", () => {
    const rows = buildDefaultPreferenceRows();
    expect(rows).toHaveLength(4);
  });

  it("has correct channel values", () => {
    const rows = buildDefaultPreferenceRows();
    const channels = rows.map((r) => r.channel);
    expect(channels).toContain("email");
    expect(channels).toContain("sms");
    expect(channels).toContain("push");
    expect(channels).toContain("in_app");
  });

  it("has categoryToggles for each row", () => {
    const rows = buildDefaultPreferenceRows();
    for (const row of rows) {
      expect(typeof row.categoryToggles).toBe("object");
      expect(Object.keys(row.categoryToggles).length).toBeGreaterThan(0);
    }
  });

  it("has audienceToggles for each row", () => {
    const rows = buildDefaultPreferenceRows();
    for (const row of rows) {
      expect(typeof row.audienceToggles).toBe("object");
      expect(Object.keys(row.audienceToggles).length).toBeGreaterThan(0);
    }
  });

  it("all toggles default to true", () => {
    const rows = buildDefaultPreferenceRows();
    for (const row of rows) {
      for (const v of Object.values(row.categoryToggles)) {
        expect(v).toBe(true);
      }
      for (const v of Object.values(row.audienceToggles)) {
        expect(v).toBe(true);
      }
    }
  });

  it("email row has correct channelLabel", () => {
    const rows = buildDefaultPreferenceRows();
    const emailRow = rows.find((r) => r.channel === "email");
    expect(emailRow?.channelLabel).toBe("Email");
  });
});
