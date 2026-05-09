import { z } from "zod";

// ─── Notice Form Schema ───────────────────────────────────────────────────────

export const noticeFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  category: z.string().min(1, { message: "Category is required." }),
  priority: z.enum(["low", "medium", "high", "urgent"] as const, {
    message: "Priority is required.",
  }),
  audience: z
    .array(z.enum(["all", "students", "teachers", "employees", "parents", "guardians"] as const))
    .min(1, { message: "Select at least one audience." }),
  publishDate: z.string().min(1, { message: "Publish date is required." }),
  expiryDate: z.string().optional(),
  body: z.string().min(10, { message: "Body must be at least 10 characters." }),
  pinned: z.boolean(),
  status: z.enum(["draft", "published", "archived"] as const, {
    message: "Status is required.",
  }),
});

export type NoticeFormValues = z.infer<typeof noticeFormSchema>;

// ─── Event Form Schema ────────────────────────────────────────────────────────

export const eventFormSchema = z
  .object({
    title: z.string().min(3, { message: "Title must be at least 3 characters." }),
    eventType: z.enum(
      ["academic", "holiday", "exam", "meeting", "sport", "cultural", "other"] as const,
      { message: "Event type is required." }
    ),
    startDate: z.string().min(1, { message: "Start date is required." }),
    endDate: z.string().optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    location: z.string().optional(),
    audience: z
      .array(z.enum(["all", "students", "teachers", "employees", "parents", "guardians"] as const))
      .min(1, { message: "Select at least one audience." }),
    description: z.string().optional(),
    status: z.enum(["upcoming", "ongoing", "completed", "cancelled"] as const, {
      message: "Status is required.",
    }),
  })
  .refine(
    (data) => {
      if (data.endDate && data.startDate) {
        return new Date(data.endDate) >= new Date(data.startDate);
      }
      return true;
    },
    {
      message: "End date must be on or after start date.",
      path: ["endDate"],
    }
  );

export type EventFormValues = z.infer<typeof eventFormSchema>;

// ─── Message Form Schema ──────────────────────────────────────────────────────

export const messageFormSchema = z.object({
  threadId: z.string().optional(),
  recipientIds: z
    .array(z.string())
    .min(1, { message: "At least one recipient is required." }),
  subject: z.string().optional(),
  body: z.string().min(1, { message: "Message body is required." }),
  priority: z.enum(["normal", "high"] as const).optional(),
});

export type MessageFormValues = z.infer<typeof messageFormSchema>;

// ─── Message Thread Filter Schema ─────────────────────────────────────────────

export const messageThreadFilterSchema = z.object({
  search: z.string().optional(),
});

export type MessageThreadFilterValues = z.infer<typeof messageThreadFilterSchema>;
