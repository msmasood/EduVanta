import type { ApiResponse, QueryParams } from "@/types/common";
import type { AttendanceRecord, AttendanceSummary } from "@/types/attendance";
import type { AttendanceStatus } from "@/types/common";
import { attendanceRecords, attendanceSummaries } from "@/data/mock/attendance";
import { withMockDelay } from "./delay";
import { createMockResponse } from "./helpers";

export async function getAttendanceRecords(
  entityType?: "student" | "teacher" | "employee",
  date?: string,
  ms = 250
): Promise<ApiResponse<AttendanceRecord[]>> {
  let filtered = [...attendanceRecords];
  if (entityType) filtered = filtered.filter((r) => r.entityType === entityType);
  if (date) filtered = filtered.filter((r) => r.date === date);
  return withMockDelay(createMockResponse(filtered), ms);
}

export async function getEntityAttendance(
  entityId: string,
  entityType: "student" | "teacher" | "employee",
  ms = 250
): Promise<ApiResponse<AttendanceRecord[]>> {
  const filtered = attendanceRecords.filter(
    (r) => r.entityId === entityId && r.entityType === entityType
  );
  return withMockDelay(createMockResponse(filtered), ms);
}

export async function getAttendanceSummary(
  entityId: string,
  ms = 250
): Promise<ApiResponse<AttendanceSummary | null>> {
  const summary = attendanceSummaries.find((s) => s.entityId === entityId) ?? null;
  return withMockDelay(createMockResponse(summary), ms);
}

export async function getAttendanceSummaries(
  entityType?: "student" | "teacher" | "employee",
  ms = 250
): Promise<ApiResponse<AttendanceSummary[]>> {
  const filtered = entityType
    ? attendanceSummaries.filter((s) => s.entityType === entityType)
    : attendanceSummaries;
  return withMockDelay(createMockResponse(filtered), ms);
}
