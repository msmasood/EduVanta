import type { ApiResponse } from "@/types/common";
import type { Notification } from "@/types/notifications";
import { notifications } from "@/data/mock/notifications";
import { withMockDelay } from "./delay";
import { createMockResponse } from "./helpers";

export async function getUserNotifications(userId: string, ms = 250): Promise<ApiResponse<Notification[]>> {
  const userNotifs = notifications.filter((n) => n.recipientId === userId);
  return withMockDelay(createMockResponse(userNotifs), ms);
}

export async function getUnreadNotifications(userId: string, ms = 250): Promise<ApiResponse<Notification[]>> {
  const unread = notifications.filter((n) => n.recipientId === userId && !n.isRead);
  return withMockDelay(createMockResponse(unread), ms);
}

export async function getUnreadCount(userId: string, ms = 250): Promise<ApiResponse<number>> {
  const count = notifications.filter((n) => n.recipientId === userId && !n.isRead).length;
  return withMockDelay(createMockResponse(count), ms);
}
