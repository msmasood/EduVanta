import type { PaginatedResponse, ApiResponse, QueryParams } from "@/types/common";
import type { Notice, CalendarEvent, MessageThread, Message } from "@/types/communication";
import { notices, calendarEvents, messageThreads, messages } from "@/data/mock/communication";
import { withMockDelay } from "./delay";
import { createMockResponse, createPaginatedResponse, applyQueryParams } from "./helpers";

export async function getNotices(params?: QueryParams, ms = 250): Promise<PaginatedResponse<Notice>> {
  let filtered = applyQueryParams(notices, params, ["title", "body"] as (keyof Notice)[]);
  // Pinned notices first
  filtered = [...filtered].sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));
  return withMockDelay(createPaginatedResponse(filtered, params), ms);
}

export async function getCalendarEvents(
  from?: string,
  to?: string,
  ms = 250
): Promise<ApiResponse<CalendarEvent[]>> {
  let filtered = [...calendarEvents];
  if (from) filtered = filtered.filter((e) => e.endDate >= from);
  if (to) filtered = filtered.filter((e) => e.startDate <= to);
  filtered.sort((a, b) => a.startDate.localeCompare(b.startDate));
  return withMockDelay(createMockResponse(filtered), ms);
}

export async function getUserThreads(userId: string, ms = 250): Promise<ApiResponse<MessageThread[]>> {
  const threads = messageThreads.filter((t) => t.participants.includes(userId));
  return withMockDelay(createMockResponse(threads), ms);
}

export async function getThreadMessages(threadId: string, ms = 250): Promise<ApiResponse<Message[]>> {
  const msgs = messages.filter((m) => m.threadId === threadId);
  return withMockDelay(createMockResponse(msgs), ms);
}
