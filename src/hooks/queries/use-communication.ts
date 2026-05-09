"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./query-keys";
import {
  getNotices,
  getCalendarEvents,
  getUserThreads,
  getThreadMessages,
} from "@/services/mock/communication.service";
import type { QueryParams } from "@/types/common";

export function useNotices(params?: QueryParams) {
  return useQuery({
    queryKey: queryKeys.communication.notices(params),
    queryFn: () => getNotices(params),
  });
}

export function useCalendarEvents(from?: string, to?: string) {
  return useQuery({
    queryKey: queryKeys.communication.events(from, to),
    queryFn: () => getCalendarEvents(from, to),
  });
}

export function useUserThreads(userId: string) {
  return useQuery({
    queryKey: queryKeys.communication.threads(userId),
    queryFn: () => getUserThreads(userId),
    enabled: !!userId,
  });
}

export function useThreadMessages(threadId: string) {
  return useQuery({
    queryKey: queryKeys.communication.messages(threadId),
    queryFn: () => getThreadMessages(threadId),
    enabled: !!threadId,
  });
}
