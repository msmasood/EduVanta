"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./query-keys";
import {
  getLeaveTypes,
  getLeaveRequests,
  getEntityLeaveRequests,
  getPendingLeaveRequests,
} from "@/services/mock/leaves.service";
import type { QueryParams } from "@/types/common";

export function useLeaveTypes() {
  return useQuery({ queryKey: queryKeys.leaves.types(), queryFn: () => getLeaveTypes() });
}

export function useLeaveRequests(params?: QueryParams) {
  return useQuery({
    queryKey: queryKeys.leaves.requests(params),
    queryFn: () => getLeaveRequests(params),
  });
}

export function useEntityLeaveRequests(entityId: string) {
  return useQuery({
    queryKey: queryKeys.leaves.entityRequests(entityId),
    queryFn: () => getEntityLeaveRequests(entityId),
    enabled: !!entityId,
  });
}

export function usePendingLeaveRequests() {
  return useQuery({
    queryKey: queryKeys.leaves.pending(),
    queryFn: () => getPendingLeaveRequests(),
  });
}
