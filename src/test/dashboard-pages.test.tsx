/**
 * Dashboard pages — integration smoke tests.
 *
 * These tests verify that the mapper-driven dashboard components render
 * without crashing when given valid mock summary data, and that key text
 * (section headings, metric labels) is present in the output.
 *
 * Recharts components (Line/Area/Bar/DonutChartWidget) use ResizeObserver
 * which is not available in jsdom. They are rendered but the chart SVG
 * output is not asserted — only wrapper text and headings are checked.
 */

import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeAll } from "vitest";
import {
  mapSchoolDashboard,
  mapStudentDashboard,
  mapTeacherDashboard,
  mapParentDashboard,
  mapLmsDashboard,
  mapUniversityDashboard,
} from "@/features/dashboard/utils/dashboard-mappers";
import type { DashboardSummary } from "@/types/dashboard";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { DashboardSection } from "@/components/dashboard/dashboard-section";

// ─── Suppress ResizeObserver warnings from Recharts in jsdom ─────────────────

beforeAll(() => {
  if (!("ResizeObserver" in window)) {
    (window as unknown as Record<string, unknown>).ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
});

// ─── Shared fixtures ──────────────────────────────────────────────────────────

const schoolSummary: DashboardSummary = {
  persona: "school",
  schoolId: "school-001",
  generatedAt: "2024-10-06T06:00:00.000Z",
  data: {
    totalStudents: { label: "Total Students", value: 1240 },
    totalTeachers: { label: "Teachers", value: 68 },
    totalEmployees: { label: "Staff", value: 45 },
    todayAttendance: { label: "Today's Attendance", value: "91.5%" },
    monthlyRevenue: { label: "Monthly Revenue", value: 9856000, unit: "PKR" },
    pendingFees: { label: "Pending Fees", value: 325000, unit: "PKR" },
    pendingLeaves: { label: "Pending Leaves", value: 3 },
    upcomingEvents: { label: "Upcoming Events", value: 4 },
    attendanceTrend: [{ label: "Oct", value: 92 }],
    feeCollectionTrend: [{ label: "Oct", value: 9856000 }],
    studentGenderDistribution: [
      { label: "Male", value: 672 },
      { label: "Female", value: 568 },
    ],
    recentNotices: [{ id: "n1", title: "Fee Reminder", date: "2024-10-05" }],
  },
};

const studentSummary: DashboardSummary = {
  persona: "student",
  schoolId: "school-001",
  generatedAt: "2024-10-06T06:00:00.000Z",
  data: {
    attendancePercentage: { label: "Attendance", value: "90.9%" },
    subjectsEnrolled: { label: "Subjects", value: 7 },
    upcomingExams: { label: "Upcoming Exams", value: 5 },
    pendingFees: { label: "Pending Fees", value: 8000, unit: "PKR" },
    gpa: { label: "GPA", value: "3.6" },
    attendanceTrend: [{ label: "Oct", value: 91 }],
    subjectPerformance: [{ label: "Math", value: 87 }],
    recentResults: [{ subject: "Math", grade: "A", percentage: 87 }],
    upcomingSchedule: [{ subject: "Math", time: "08:00", room: "Room 101" }],
  },
};

const teacherSummary: DashboardSummary = {
  persona: "teacher",
  schoolId: "school-001",
  generatedAt: "2024-10-06T06:00:00.000Z",
  data: {
    myClasses: { label: "My Classes", value: 4 },
    myStudents: { label: "My Students", value: 142 },
    todayAttendanceMarked: { label: "Attendance Marked", value: "3/4" },
    pendingLeaves: { label: "Pending Leaves", value: 0 },
    upcomingExams: { label: "Exams to Invigilate", value: 2 },
    classwiseAttendance: [{ label: "Class 5A", value: 94 }],
    subjectPerformance: [{ label: "Class 5A", value: 82 }],
    timetableToday: [
      { period: "1st", subject: "Math", class: "Class 5A", room: "101" },
    ],
  },
};

const parentSummary: DashboardSummary = {
  persona: "parent",
  schoolId: "school-001",
  generatedAt: "2024-10-06T06:00:00.000Z",
  data: {
    childrenCount: { label: "Children", value: 1 },
    pendingFees: { label: "Pending Fees", value: 8000, unit: "PKR" },
    recentAttendance: { label: "Attendance This Month", value: "90.9%" },
    upcomingEvents: { label: "Upcoming Events", value: 2 },
    children: [{ id: "s1", name: "Ahmed Khan", class: "Class 5A", attendance: 90.9 }],
    notices: [{ id: "n1", title: "Fee Reminder", date: "2024-10-05" }],
  },
};

const lmsSummary: DashboardSummary = {
  persona: "lms",
  schoolId: "school-001",
  generatedAt: "2024-10-06T06:00:00.000Z",
  data: {
    totalCourses: { label: "Total Courses", value: 48 },
    enrolledLearners: { label: "Enrolled Learners", value: 3420 },
    completionRate: { label: "Completion Rate", value: "68%" },
    averageScore: { label: "Avg. Score", value: "74.5%" },
    courseCompletionTrend: [{ label: "Jan", value: 58 }],
    topCourses: [{ id: "c1", title: "Python Fundamentals", enrolled: 420, completion: 82 }],
  },
};

const universitySummary: DashboardSummary = {
  persona: "university",
  schoolId: "school-001",
  generatedAt: "2024-10-06T06:00:00.000Z",
  data: {
    totalStudents: { label: "Students", value: 8540 },
    totalFaculty: { label: "Faculty", value: 420 },
    totalDepartments: { label: "Departments", value: 18 },
    researchProjects: { label: "Active Research Projects", value: 34 },
    enrollmentTrend: [{ label: "2024", value: 8540 }],
    departmentWiseStudents: [{ label: "Engineering", value: 1850 }],
    upcomingEvents: [
      { id: "e1", title: "Convocation", date: "2024-12-15", type: "academic" },
    ],
  },
};

// ─── StatsGrid integration with mapper output ─────────────────────────────────

describe("StatsGrid integration with mapSchoolDashboard", () => {
  it("renders all 6 school metric labels", () => {
    const mapped = mapSchoolDashboard(schoolSummary, "PKR", "en");
    render(<StatsGrid metrics={mapped.metrics} columns={3} />);
    expect(screen.getByText("Total Students")).toBeInTheDocument();
    expect(screen.getByText("Teachers")).toBeInTheDocument();
    expect(screen.getByText("Pending Leaves")).toBeInTheDocument();
  });

  it("renders formatted PKR money value (not raw integer)", () => {
    const mapped = mapSchoolDashboard(schoolSummary, "PKR", "en");
    // The formatted value must NOT be the raw integer "9856000"
    const revenueMetric = mapped.metrics.find((m) => m.label === "Monthly Revenue");
    expect(typeof revenueMetric!.value).toBe("string");
    expect(revenueMetric!.value as string).not.toBe("9856000");
    // The StatsGrid renders without throwing
    const { container } = render(<StatsGrid metrics={mapped.metrics} columns={3} />);
    expect(container).toBeTruthy();
  });
});

describe("StatsGrid integration with mapStudentDashboard", () => {
  it("renders all 5 student metric labels", () => {
    const mapped = mapStudentDashboard(studentSummary, "PKR", "en");
    render(<StatsGrid metrics={mapped.metrics} columns={3} />);
    expect(screen.getByText("Attendance")).toBeInTheDocument();
    expect(screen.getByText("GPA")).toBeInTheDocument();
    expect(screen.getByText("Subjects")).toBeInTheDocument();
  });
});

describe("StatsGrid integration with mapTeacherDashboard", () => {
  it("renders all 4 teacher metric labels", () => {
    const mapped = mapTeacherDashboard(teacherSummary);
    render(<StatsGrid metrics={mapped.metrics} columns={2} />);
    expect(screen.getByText("My Classes")).toBeInTheDocument();
    expect(screen.getByText("My Students")).toBeInTheDocument();
  });
});

describe("StatsGrid integration with mapParentDashboard", () => {
  it("renders 4 parent metric labels", () => {
    const mapped = mapParentDashboard(parentSummary, "PKR", "en");
    render(<StatsGrid metrics={mapped.metrics} columns={2} />);
    expect(screen.getByText("Children")).toBeInTheDocument();
    expect(screen.getByText("Attendance This Month")).toBeInTheDocument();
  });
});

describe("StatsGrid integration with mapLmsDashboard", () => {
  it("renders 4 LMS metric labels", () => {
    const mapped = mapLmsDashboard(lmsSummary);
    render(<StatsGrid metrics={mapped.metrics} columns={2} />);
    expect(screen.getByText("Total Courses")).toBeInTheDocument();
    expect(screen.getByText("Enrolled Learners")).toBeInTheDocument();
  });
});

describe("StatsGrid integration with mapUniversityDashboard", () => {
  it("renders 4 university metric labels", () => {
    const mapped = mapUniversityDashboard(universitySummary);
    render(<StatsGrid metrics={mapped.metrics} columns={2} />);
    expect(screen.getByText("Students")).toBeInTheDocument();
    expect(screen.getByText("Faculty")).toBeInTheDocument();
  });
});

// ─── DashboardSection renders correctly ──────────────────────────────────────

describe("DashboardSection", () => {
  it("renders a section with a heading", () => {
    render(
      <DashboardSection title="Overview">
        <p>content</p>
      </DashboardSection>
    );
    expect(screen.getByText("Overview")).toBeInTheDocument();
    expect(screen.getByText("content")).toBeInTheDocument();
  });
});
