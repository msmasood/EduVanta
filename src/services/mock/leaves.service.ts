import type { PaginatedResponse, ApiResponse, QueryParams } from "@/types/common";
import type { LeaveType, LeaveRequest } from "@/types/leaves";
import { leaveTypes, leaveRequests } from "@/data/mock/leaves";
import { withMockDelay } from "./delay";
import { createMockResponse, createPaginatedResponse, applyQueryParams } from "./helpers";

export async function getLeaveTypes(ms = 250): Promise<ApiResponse<LeaveType[]>> {
  return withMockDelay(createMockResponse(leaveTypes), ms);
}

export async function getLeaveRequests(params?: QueryParams, ms = 250): Promise<PaginatedResponse<LeaveRequest>> {
  const filtered = applyQueryParams(leaveRequests, params, ["reason"] as (keyof LeaveRequest)[]);
  return withMockDelay(createPaginatedResponse(filtered, params), ms);
}

export async function getEntityLeaveRequests(
  entityId: string,
  entityType?: LeaveRequest["entityType"],
  ms = 250
): Promise<ApiResponse<LeaveRequest[]>> {
  let filtered = leaveRequests.filter((r) => r.entityId === entityId);
  if (entityType) filtered = filtered.filter((r) => r.entityType === entityType);
  return withMockDelay(createMockResponse(filtered), ms);
}

export async function getPendingLeaveRequests(ms = 250): Promise<ApiResponse<LeaveRequest[]>> {
  const pending = leaveRequests.filter((r) => r.status === "pending");
  return withMockDelay(createMockResponse(pending), ms);
}
