"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./query-keys";
import {
  getAttendanceRecords,
  getEntityAttendance,
  getAttendanceSummary,
  getAttendanceSummaries,
} from "@/services/mock/attendance.service";

export function useAttendanceRecords(
  entityType?: "student" | "teacher" | "employee",
  date?: string
) {
  return useQuery({
    queryKey: queryKeys.attendance.records(entityType, date),
    queryFn: () => getAttendanceRecords(entityType, date),
  });
}

export function useEntityAttendance(entityId: string, entityType: "student" | "teacher" | "employee") {
  return useQuery({
    queryKey: queryKeys.attendance.entity(entityId, entityType),
    queryFn: () => getEntityAttendance(entityId, entityType),
    enabled: !!entityId,
  });
}

export function useAttendanceSummary(entityId: string) {
  return useQuery({
    queryKey: queryKeys.attendance.summary(entityId),
    queryFn: () => getAttendanceSummary(entityId),
    enabled: !!entityId,
  });
}

export function useAttendanceSummaries(entityType?: "student" | "teacher" | "employee") {
  return useQuery({
    queryKey: queryKeys.attendance.summaries(entityType),
    queryFn: () => getAttendanceSummaries(entityType),
  });
}
