import type { ID, AuditMeta, ProcessStatus } from "./common";

// ─── Leave type ───────────────────────────────────────────────────────────────

export interface LeaveType {
  id: ID;
  schoolId: ID;
  name: string;
  totalDays: number;
  applicableTo: ("student" | "teacher" | "employee")[];
  isPaid: boolean;
  audit: AuditMeta;
}

// ─── Leave request ────────────────────────────────────────────────────────────

export type LeaveStatus = ProcessStatus;

export interface LeaveRequest {
  id: ID;
  schoolId: ID;
  leaveTypeId: ID;
  entityType: "student" | "teacher" | "employee";
  entityId: ID;
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  reviewedBy?: ID;
  reviewedAt?: string;
  reviewNotes?: string;
  appliedAt: string;
  audit: AuditMeta;
}
