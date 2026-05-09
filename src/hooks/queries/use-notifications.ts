"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./query-keys";
import {
  getUserNotifications,
  getUnreadNotifications,
  getUnreadCount,
} from "@/services/mock/notifications.service";

export function useNotifications(userId: string) {
  return useQuery({
    queryKey: queryKeys.notifications.user(userId),
    queryFn: () => getUserNotifications(userId),
    enabled: !!userId,
  });
}

export function useUnreadNotifications(userId: string) {
  return useQuery({
    queryKey: queryKeys.notifications.unread(userId),
    queryFn: () => getUnreadNotifications(userId),
    enabled: !!userId,
  });
}

export function useUnreadNotificationCount(userId: string) {
  return useQuery({
    queryKey: queryKeys.notifications.unreadCount(userId),
    queryFn: () => getUnreadCount(userId),
    enabled: !!userId,
  });
}
