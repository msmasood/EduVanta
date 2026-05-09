import type { ID, AuditMeta } from "./common";

// ─── Exam ─────────────────────────────────────────────────────────────────────

export type ExamStatus = "upcoming" | "ongoing" | "completed" | "cancelled";

export interface Exam {
  id: ID;
  schoolId: ID;
  name: string;
  academicYearId: ID;
  termName: string;
  startDate: string;
  endDate: string;
  status: ExamStatus;
  audit: AuditMeta;
}

// ─── Exam schedule ────────────────────────────────────────────────────────────

export interface ExamSchedule {
  id: ID;
  examId: ID;
  subjectId: ID;
  classId: ID;
  date: string;
  startTime: string;
  endTime: string;
  classroomId: ID;
  maxMarks: number;
  passingMarks: number;
  audit: AuditMeta;
}

// ─── Grade scale ──────────────────────────────────────────────────────────────

export interface GradeScale {
  grade: string;
  label: string;
  minPercentage: number;
  maxPercentage: number;
}

// ─── Exam result ─────────────────────────────────────────────────────────────

export type ResultStatus = "pass" | "fail" | "absent" | "pending";

export interface ExamResult {
  id: ID;
  examScheduleId: ID;
  studentId: ID;
  marksObtained: number;
  maxMarks: number;
  percentage: number;
  grade: string;
  status: ResultStatus;
  remarks?: string;
  audit: AuditMeta;
}
