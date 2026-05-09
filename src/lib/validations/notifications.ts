import { z } from "zod";

// ─── Notification Filter Schema ───────────────────────────────────────────────

export const notificationFilterSchema = z.object({
  category: z
    .enum(["attendance", "fees", "exam", "leave", "notice", "message", "system"] as const)
    .optional(),
  isRead: z.boolean().optional(),
  search: z.string().optional(),
});

export type NotificationFilterValues = z.infer<typeof notificationFilterSchema>;

// ─── Notification Preference Schema ──────────────────────────────────────────

export const notificationPreferenceSchema = z.object({
  channel: z.enum(["email", "sms", "push", "in_app"] as const, {
    message: "Channel is required.",
  }),
  enabled: z.boolean().default(true),
  category: z
    .enum(["attendance", "fees", "exam", "leave", "notice", "message", "system"] as const)
    .optional(),
  audience: z
    .enum(["all", "students", "teachers", "employees", "parents", "guardians"] as const)
    .optional(),
});

export type NotificationPreferenceValues = z.infer<typeof notificationPreferenceSchema>;

// ─── Notification Alert Schema ────────────────────────────────────────────────

export const notificationAlertSchema = z.object({
  channel: z.enum(["email", "sms", "push", "in_app"] as const, {
    message: "Channel is required.",
  }),
  categoryToggles: z.record(z.string(), z.boolean()),
  audienceToggles: z.record(z.string(), z.boolean()),
});

export type NotificationAlertValues = z.infer<typeof notificationAlertSchema>;
