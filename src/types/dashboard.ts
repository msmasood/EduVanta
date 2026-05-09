import type { MoneyAmount } from "./common";

// ─── Dashboard metric ─────────────────────────────────────────────────────────

export type MetricVariant = "default" | "success" | "warning" | "destructive" | "info";

export interface DashboardMetric {
  label: string;
  value: number | string;
  unit?: string;
  icon?: string;
  trend?: DashboardTrend;
  /** Optional monetary value — takes precedence over `value` for display */
  moneyValue?: MoneyAmount;
  /** Optional color variant for the card */
  variant?: MetricVariant;
  /** Optional sub-label shown below the value */
  description?: string;
}

export interface DashboardTrend {
  direction: "up" | "down" | "neutral";
  percentage: number;
  label: string;
}

// ─── Chart data ───────────────────────────────────────────────────────────────

export interface ChartDataPoint {
  label: string;
  value: number;
  value2?: number;
  color?: string;
}

// ─── Dashboard persona types ──────────────────────────────────────────────────

export type DashboardPersona = "school" | "student" | "teacher" | "parent" | "lms" | "university";

export interface SchoolDashboardData {
  totalStudents: DashboardMetric;
  totalTeachers: DashboardMetric;
  totalEmployees: DashboardMetric;
  todayAttendance: DashboardMetric;
  monthlyRevenue: DashboardMetric;
  pendingFees: DashboardMetric;
  pendingLeaves: DashboardMetric;
  upcomingEvents: DashboardMetric;
  attendanceTrend: ChartDataPoint[];
  feeCollectionTrend: ChartDataPoint[];
  studentGenderDistribution: ChartDataPoint[];
  recentNotices: { id: string; title: string; date: string }[];
}

export interface StudentDashboardData {
  attendancePercentage: DashboardMetric;
  subjectsEnrolled: DashboardMetric;
  upcomingExams: DashboardMetric;
  pendingFees: DashboardMetric;
  gpa: DashboardMetric;
  attendanceTrend: ChartDataPoint[];
  subjectPerformance: ChartDataPoint[];
  recentResults: { subject: string; grade: string; percentage: number }[];
  upcomingSchedule: { subject: string; time: string; room: string }[];
}

export interface TeacherDashboardData {
  myClasses: DashboardMetric;
  myStudents: DashboardMetric;
  todayAttendanceMarked: DashboardMetric;
  pendingLeaves: DashboardMetric;
  upcomingExams: DashboardMetric;
  classwiseAttendance: ChartDataPoint[];
  subjectPerformance: ChartDataPoint[];
  timetableToday: { period: string; subject: string; class: string; room: string }[];
}

export interface ParentDashboardData {
  childrenCount: DashboardMetric;
  pendingFees: DashboardMetric;
  recentAttendance: DashboardMetric;
  upcomingEvents: DashboardMetric;
  children: { id: string; name: string; class: string; attendance: number }[];
  notices: { id: string; title: string; date: string }[];
}

export interface LMSDashboardData {
  totalCourses: DashboardMetric;
  enrolledLearners: DashboardMetric;
  completionRate: DashboardMetric;
  averageScore: DashboardMetric;
  courseCompletionTrend: ChartDataPoint[];
  topCourses: { id: string; title: string; enrolled: number; completion: number }[];
}

export interface UniversityDashboardData {
  totalStudents: DashboardMetric;
  totalFaculty: DashboardMetric;
  totalDepartments: DashboardMetric;
  researchProjects: DashboardMetric;
  enrollmentTrend: ChartDataPoint[];
  departmentWiseStudents: ChartDataPoint[];
  upcomingEvents: { id: string; title: string; date: string; type: string }[];
}

export type RoleDashboardData =
  | SchoolDashboardData
  | StudentDashboardData
  | TeacherDashboardData
  | ParentDashboardData
  | LMSDashboardData
  | UniversityDashboardData;

export interface DashboardSummary {
  persona: DashboardPersona;
  schoolId: string;
  generatedAt: string;
  data: RoleDashboardData;
}
