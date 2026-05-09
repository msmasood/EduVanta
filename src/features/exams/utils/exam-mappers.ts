// exam-mappers.ts — data transformation utilities for exam module

import type { Exam, ExamSchedule, ExamResult, ExamStatus, ResultStatus } from "@/types/exams";
import type { StatusVariant } from "@/components/data-table/status-badge";
import type { Subject } from "@/types/academic";
import type { ClassLevel } from "@/types/academic";
import type { Student } from "@/types/student";

// ─── Status mappings ──────────────────────────────────────────────────────────

export function examStatusToVariant(status: ExamStatus): StatusVariant {
  const map: Record<ExamStatus, StatusVariant> = {
    upcoming: "info",
    ongoing: "active",
    completed: "success",
    cancelled: "destructive",
  };
  return map[status] ?? "neutral";
}

export function examStatusLabel(status: ExamStatus): string {
  const map: Record<ExamStatus, string> = {
    upcoming: "Upcoming",
    ongoing: "Ongoing",
    completed: "Completed",
    cancelled: "Cancelled",
  };
  return map[status] ?? status;
}

export function resultStatusToVariant(status: ResultStatus): StatusVariant {
  const map: Record<ResultStatus, StatusVariant> = {
    pass: "success",
    fail: "destructive",
    absent: "absent",
    pending: "pending",
  };
  return map[status] ?? "neutral";
}

export function resultStatusLabel(status: ResultStatus): string {
  const map: Record<ResultStatus, string> = {
    pass: "Pass",
    fail: "Fail",
    absent: "Absent",
    pending: "Pending",
  };
  return map[status] ?? status;
}

// ─── Grade → StatusVariant ────────────────────────────────────────────────────

export function gradeToVariant(grade: string): StatusVariant {
  if (grade === "A+" || grade === "A") return "success";
  if (grade === "B+" || grade === "B") return "active";
  if (grade === "C+" || grade === "C") return "info";
  if (grade === "D") return "warning";
  return "destructive";
}

// ─── Exam table row ───────────────────────────────────────────────────────────

export interface ExamTableRow {
  id: string;
  name: string;
  termName: string;
  startDate: string;
  endDate: string;
  status: ExamStatus;
  statusVariant: StatusVariant;
  statusLabel: string;
}

export function mapExamsToRows(exams: Exam[]): ExamTableRow[] {
  return exams.map((exam) => ({
    id: exam.id,
    name: exam.name,
    termName: exam.termName,
    startDate: exam.startDate,
    endDate: exam.endDate,
    status: exam.status,
    statusVariant: examStatusToVariant(exam.status),
    statusLabel: examStatusLabel(exam.status),
  }));
}

// ─── Exam schedule table row ──────────────────────────────────────────────────

export interface ExamScheduleTableRow {
  id: string;
  examId: string;
  examName: string;
  subjectId: string;
  subjectName: string;
  classId: string;
  className: string;
  date: string;
  startTime: string;
  endTime: string;
  maxMarks: number;
  passingMarks: number;
}

export function mapSchedulesToRows(
  schedules: ExamSchedule[],
  exams: Exam[],
  subjects: Subject[],
  classes: ClassLevel[]
): ExamScheduleTableRow[] {
  return schedules.map((s) => {
    const exam = exams.find((e) => e.id === s.examId);
    const subject = subjects.find((sub) => sub.id === s.subjectId);
    const cls = classes.find((c) => c.id === s.classId);
    return {
      id: s.id,
      examId: s.examId,
      examName: exam?.name ?? s.examId,
      subjectId: s.subjectId,
      subjectName: subject?.name ?? s.subjectId,
      classId: s.classId,
      className: cls?.name ?? s.classId,
      date: s.date,
      startTime: s.startTime,
      endTime: s.endTime,
      maxMarks: s.maxMarks,
      passingMarks: s.passingMarks,
    };
  });
}

// ─── Exam result table row ────────────────────────────────────────────────────

export interface ExamResultTableRow {
  id: string;
  examScheduleId: string;
  studentId: string;
  studentName: string;
  subjectName: string;
  className: string;
  marksObtained: number;
  maxMarks: number;
  percentage: number;
  grade: string;
  gradeVariant: StatusVariant;
  status: ResultStatus;
  statusVariant: StatusVariant;
  statusLabel: string;
  remarks?: string;
}

export function mapResultsToRows(
  results: ExamResult[],
  schedules: ExamSchedule[],
  subjects: Subject[],
  classes: ClassLevel[],
  students: Student[]
): ExamResultTableRow[] {
  return results.map((r) => {
    const schedule = schedules.find((s) => s.id === r.examScheduleId);
    const subject = subjects.find((sub) => sub.id === schedule?.subjectId);
    const cls = classes.find((c) => c.id === schedule?.classId);
    const student = students.find((s) => s.id === r.studentId);
    const studentName = student
      ? `${student.firstName} ${student.lastName}`
      : r.studentId;
    return {
      id: r.id,
      examScheduleId: r.examScheduleId,
      studentId: r.studentId,
      studentName,
      subjectName: subject?.name ?? schedule?.subjectId ?? "—",
      className: cls?.name ?? schedule?.classId ?? "—",
      marksObtained: r.marksObtained,
      maxMarks: r.maxMarks,
      percentage: r.percentage,
      grade: r.grade,
      gradeVariant: gradeToVariant(r.grade),
      status: r.status,
      statusVariant: resultStatusToVariant(r.status),
      statusLabel: resultStatusLabel(r.status),
      remarks: r.remarks,
    };
  });
}

// ─── Summary computation ──────────────────────────────────────────────────────

export interface ExamSummary {
  total: number;
  upcoming: number;
  ongoing: number;
  completed: number;
  cancelled: number;
}

export function computeExamSummary(exams: Exam[]): ExamSummary {
  return {
    total: exams.length,
    upcoming: exams.filter((e) => e.status === "upcoming").length,
    ongoing: exams.filter((e) => e.status === "ongoing").length,
    completed: exams.filter((e) => e.status === "completed").length,
    cancelled: exams.filter((e) => e.status === "cancelled").length,
  };
}

export interface ExamResultSummary {
  total: number;
  passed: number;
  failed: number;
  absent: number;
  pending: number;
  avgPercentage: number;
}

export function computeResultSummary(results: ExamResult[]): ExamResultSummary {
  const passed = results.filter((r) => r.status === "pass").length;
  const failed = results.filter((r) => r.status === "fail").length;
  const absent = results.filter((r) => r.status === "absent").length;
  const pending = results.filter((r) => r.status === "pending").length;
  const gradedResults = results.filter(
    (r) => r.status === "pass" || r.status === "fail"
  );
  const avgPercentage =
    gradedResults.length > 0
      ? Math.round(
          gradedResults.reduce((sum, r) => sum + r.percentage, 0) /
            gradedResults.length
        )
      : 0;
  return { total: results.length, passed, failed, absent, pending, avgPercentage };
}
