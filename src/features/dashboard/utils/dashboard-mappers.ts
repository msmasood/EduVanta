/**
 * Dashboard mapper utilities for Phase 8.
 *
 * Each mapper extracts strongly-typed data from the DashboardSummary for a
 * given persona and returns a normalised shape that dashboard components can
 * consume without downcasting.
 */

import { formatCurrency } from "@/lib/currency";
import type { CurrencyCode } from "@/lib/currency";
import type {
  DashboardSummary,
  DashboardMetric,
  ChartDataPoint,
  SchoolDashboardData,
  StudentDashboardData,
  TeacherDashboardData,
  ParentDashboardData,
  LMSDashboardData,
  UniversityDashboardData,
} from "@/types/dashboard";
import type { ActivityItem } from "@/components/dashboard/recent-activity-list";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function asSchool(s: DashboardSummary): SchoolDashboardData {
  return s.data as SchoolDashboardData;
}
function asStudent(s: DashboardSummary): StudentDashboardData {
  return s.data as StudentDashboardData;
}
function asTeacher(s: DashboardSummary): TeacherDashboardData {
  return s.data as TeacherDashboardData;
}
function asParent(s: DashboardSummary): ParentDashboardData {
  return s.data as ParentDashboardData;
}
function asLms(s: DashboardSummary): LMSDashboardData {
  return s.data as LMSDashboardData;
}
function asUniversity(s: DashboardSummary): UniversityDashboardData {
  return s.data as UniversityDashboardData;
}

function moneyMetric(
  base: DashboardMetric,
  currency: CurrencyCode,
  locale: string
): DashboardMetric {
  const amount = typeof base.value === "number" ? base.value : 0;
  return {
    ...base,
    value: formatCurrency(amount, currency, locale),
    moneyValue: { amount, currency },
  };
}

// ─── School mapper ────────────────────────────────────────────────────────────

export interface SchoolDashboardMapped {
  metrics: DashboardMetric[];
  attendanceTrend: ChartDataPoint[];
  feeCollectionTrend: ChartDataPoint[];
  genderDistribution: ChartDataPoint[];
  recentNotices: { id: string; title: string; date: string }[];
  activities: ActivityItem[];
}

export function mapSchoolDashboard(
  summary: DashboardSummary,
  currency: CurrencyCode = "PKR",
  locale = "en"
): SchoolDashboardMapped {
  const d = asSchool(summary);

  const metrics: DashboardMetric[] = [
    { ...d.totalStudents, variant: "info" },
    { ...d.totalTeachers, variant: "success" },
    { ...d.todayAttendance, variant: "default" },
    moneyMetric(d.monthlyRevenue, currency, locale),
    moneyMetric(d.pendingFees, currency, locale),
    { ...d.pendingLeaves, variant: "warning" },
  ];

  const activities: ActivityItem[] = d.recentNotices.map((n) => ({
    id: n.id,
    title: n.title,
    activityType: "notice",
    timestamp: n.date,
  }));

  return {
    metrics,
    attendanceTrend: d.attendanceTrend,
    feeCollectionTrend: d.feeCollectionTrend,
    genderDistribution: d.studentGenderDistribution,
    recentNotices: d.recentNotices,
    activities,
  };
}

// ─── Student mapper ───────────────────────────────────────────────────────────

export interface StudentDashboardMapped {
  metrics: DashboardMetric[];
  attendanceTrend: ChartDataPoint[];
  subjectPerformance: ChartDataPoint[];
  recentResults: { subject: string; grade: string; percentage: number }[];
  upcomingSchedule: { subject: string; time: string; room: string }[];
}

export function mapStudentDashboard(
  summary: DashboardSummary,
  currency: CurrencyCode = "PKR",
  locale = "en"
): StudentDashboardMapped {
  const d = asStudent(summary);

  const metrics: DashboardMetric[] = [
    { ...d.attendancePercentage, variant: "success" },
    { ...d.gpa, variant: "info" },
    { ...d.subjectsEnrolled, variant: "default" },
    { ...d.upcomingExams, variant: "warning" },
    moneyMetric(d.pendingFees, currency, locale),
  ];

  return {
    metrics,
    attendanceTrend: d.attendanceTrend,
    subjectPerformance: d.subjectPerformance,
    recentResults: d.recentResults,
    upcomingSchedule: d.upcomingSchedule,
  };
}

// ─── Teacher mapper ───────────────────────────────────────────────────────────

export interface TeacherDashboardMapped {
  metrics: DashboardMetric[];
  classwiseAttendance: ChartDataPoint[];
  subjectPerformance: ChartDataPoint[];
  timetableToday: { period: string; subject: string; class: string; room: string }[];
}

export function mapTeacherDashboard(
  summary: DashboardSummary
): TeacherDashboardMapped {
  const d = asTeacher(summary);

  const metrics: DashboardMetric[] = [
    { ...d.myClasses, variant: "info" },
    { ...d.myStudents, variant: "success" },
    { ...d.todayAttendanceMarked, variant: "default" },
    { ...d.upcomingExams, variant: "warning" },
  ];

  return {
    metrics,
    classwiseAttendance: d.classwiseAttendance,
    subjectPerformance: d.subjectPerformance,
    timetableToday: d.timetableToday,
  };
}

// ─── Parent mapper ────────────────────────────────────────────────────────────

export interface ParentDashboardMapped {
  metrics: DashboardMetric[];
  children: { id: string; name: string; class: string; attendance: number }[];
  notices: { id: string; title: string; date: string }[];
}

export function mapParentDashboard(
  summary: DashboardSummary,
  currency: CurrencyCode = "PKR",
  locale = "en"
): ParentDashboardMapped {
  const d = asParent(summary);

  const metrics: DashboardMetric[] = [
    { ...d.childrenCount, variant: "info" },
    { ...d.recentAttendance, variant: "success" },
    moneyMetric(d.pendingFees, currency, locale),
    { ...d.upcomingEvents, variant: "default" },
  ];

  return {
    metrics,
    children: d.children,
    notices: d.notices,
  };
}

// ─── LMS mapper ───────────────────────────────────────────────────────────────

export interface LMSDashboardMapped {
  metrics: DashboardMetric[];
  courseCompletionTrend: ChartDataPoint[];
  topCourses: { id: string; title: string; enrolled: number; completion: number }[];
  courseDistribution: ChartDataPoint[];
}

export function mapLmsDashboard(
  summary: DashboardSummary
): LMSDashboardMapped {
  const d = asLms(summary);

  const metrics: DashboardMetric[] = [
    { ...d.totalCourses, variant: "info" },
    { ...d.enrolledLearners, variant: "success" },
    { ...d.completionRate, variant: "default" },
    { ...d.averageScore, variant: "warning" },
  ];

  const courseDistribution: ChartDataPoint[] = d.topCourses.map((c) => ({
    label: c.title.length > 18 ? c.title.slice(0, 18) + "…" : c.title,
    value: c.enrolled,
  }));

  return {
    metrics,
    courseCompletionTrend: d.courseCompletionTrend,
    topCourses: d.topCourses,
    courseDistribution,
  };
}

// ─── University mapper ────────────────────────────────────────────────────────

export interface UniversityDashboardMapped {
  metrics: DashboardMetric[];
  enrollmentTrend: ChartDataPoint[];
  departmentDistribution: ChartDataPoint[];
  upcomingEvents: { id: string; title: string; date: string; type: string }[];
}

export function mapUniversityDashboard(
  summary: DashboardSummary
): UniversityDashboardMapped {
  const d = asUniversity(summary);

  const metrics: DashboardMetric[] = [
    { ...d.totalStudents, variant: "info" },
    { ...d.totalFaculty, variant: "success" },
    { ...d.totalDepartments, variant: "default" },
    { ...d.researchProjects, variant: "warning" },
  ];

  return {
    metrics,
    enrollmentTrend: d.enrollmentTrend,
    departmentDistribution: d.departmentWiseStudents,
    upcomingEvents: d.upcomingEvents,
  };
}
