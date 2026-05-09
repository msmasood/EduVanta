/**
 * Tests for dashboard-mappers.ts utilities.
 */
import { describe, it, expect } from "vitest";
import {
  mapSchoolDashboard,
  mapStudentDashboard,
  mapTeacherDashboard,
  mapParentDashboard,
  mapLmsDashboard,
  mapUniversityDashboard,
} from "@/features/dashboard/utils/dashboard-mappers";
import type { DashboardSummary } from "@/types/dashboard";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

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
    recentNotices: [
      { id: "n1", title: "Fee Reminder", date: "2024-10-05" },
    ],
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
    children: [{ id: "student-001", name: "Ahmed Khan", class: "Class 5A", attendance: 90.9 }],
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
    topCourses: [
      { id: "c1", title: "Python", enrolled: 420, completion: 82 },
    ],
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

// ─── School mapper ────────────────────────────────────────────────────────────

describe("mapSchoolDashboard", () => {
  it("returns 6 metrics", () => {
    const result = mapSchoolDashboard(schoolSummary, "PKR", "en");
    expect(result.metrics).toHaveLength(6);
  });

  it("money metrics have MoneyAmount set", () => {
    const result = mapSchoolDashboard(schoolSummary, "PKR", "en");
    const revenueMetric = result.metrics.find((m) => m.label === "Monthly Revenue");
    expect(revenueMetric?.moneyValue).toBeDefined();
    expect(revenueMetric?.moneyValue?.currency).toBe("PKR");
    expect(revenueMetric?.moneyValue?.amount).toBe(9856000);
  });

  it("pending fees metric has MoneyAmount", () => {
    const result = mapSchoolDashboard(schoolSummary, "PKR", "en");
    const feesMetric = result.metrics.find((m) => m.label === "Pending Fees");
    expect(feesMetric?.moneyValue?.amount).toBe(325000);
  });

  it("returns attendance trend data", () => {
    const result = mapSchoolDashboard(schoolSummary);
    expect(result.attendanceTrend).toHaveLength(1);
    expect(result.attendanceTrend[0].label).toBe("Oct");
  });

  it("returns fee collection trend", () => {
    const result = mapSchoolDashboard(schoolSummary);
    expect(result.feeCollectionTrend[0].value).toBe(9856000);
  });

  it("returns gender distribution", () => {
    const result = mapSchoolDashboard(schoolSummary);
    expect(result.genderDistribution).toHaveLength(2);
  });

  it("returns recent notices", () => {
    const result = mapSchoolDashboard(schoolSummary);
    expect(result.recentNotices).toHaveLength(1);
    expect(result.recentNotices[0].id).toBe("n1");
  });

  it("returns activities mapped from notices", () => {
    const result = mapSchoolDashboard(schoolSummary);
    expect(result.activities[0].activityType).toBe("notice");
  });

  it("uses provided currency in formatted value", () => {
    const resultPKR = mapSchoolDashboard(schoolSummary, "PKR", "en");
    const resultUSD = mapSchoolDashboard(schoolSummary, "USD", "en");
    expect(resultPKR.metrics[3].value).not.toBe(resultUSD.metrics[3].value);
  });
});

// ─── Student mapper ───────────────────────────────────────────────────────────

describe("mapStudentDashboard", () => {
  it("returns 5 student metrics", () => {
    const result = mapStudentDashboard(studentSummary, "PKR", "en");
    expect(result.metrics).toHaveLength(5);
  });

  it("pending fees metric has MoneyAmount", () => {
    const result = mapStudentDashboard(studentSummary, "PKR", "en");
    const feesMetric = result.metrics.find((m) => m.label === "Pending Fees");
    expect(feesMetric?.moneyValue?.amount).toBe(8000);
    expect(feesMetric?.moneyValue?.currency).toBe("PKR");
  });

  it("returns attendance trend", () => {
    const result = mapStudentDashboard(studentSummary);
    expect(result.attendanceTrend).toHaveLength(1);
  });

  it("returns subject performance data", () => {
    const result = mapStudentDashboard(studentSummary);
    expect(result.subjectPerformance[0].label).toBe("Math");
  });

  it("returns recent results", () => {
    const result = mapStudentDashboard(studentSummary);
    expect(result.recentResults[0].subject).toBe("Math");
  });

  it("returns upcoming schedule", () => {
    const result = mapStudentDashboard(studentSummary);
    expect(result.upcomingSchedule[0].room).toBe("Room 101");
  });
});

// ─── Teacher mapper ───────────────────────────────────────────────────────────

describe("mapTeacherDashboard", () => {
  it("returns 4 teacher metrics", () => {
    const result = mapTeacherDashboard(teacherSummary);
    expect(result.metrics).toHaveLength(4);
  });

  it("returns timetable data", () => {
    const result = mapTeacherDashboard(teacherSummary);
    expect(result.timetableToday).toHaveLength(1);
    expect(result.timetableToday[0].period).toBe("1st");
  });

  it("returns classwise attendance chart data", () => {
    const result = mapTeacherDashboard(teacherSummary);
    expect(result.classwiseAttendance[0].value).toBe(94);
  });

  it("returns subject performance chart data", () => {
    const result = mapTeacherDashboard(teacherSummary);
    expect(result.subjectPerformance[0].value).toBe(82);
  });
});

// ─── Parent mapper ────────────────────────────────────────────────────────────

describe("mapParentDashboard", () => {
  it("returns 4 parent metrics", () => {
    const result = mapParentDashboard(parentSummary, "PKR", "en");
    expect(result.metrics).toHaveLength(4);
  });

  it("fee metric has MoneyAmount", () => {
    const result = mapParentDashboard(parentSummary, "PKR", "en");
    const feesMetric = result.metrics.find((m) => m.label === "Pending Fees");
    expect(feesMetric?.moneyValue?.amount).toBe(8000);
  });

  it("returns children data", () => {
    const result = mapParentDashboard(parentSummary);
    expect(result.children).toHaveLength(1);
    expect(result.children[0].name).toBe("Ahmed Khan");
  });

  it("returns notices", () => {
    const result = mapParentDashboard(parentSummary);
    expect(result.notices[0].id).toBe("n1");
  });
});

// ─── LMS mapper ───────────────────────────────────────────────────────────────

describe("mapLmsDashboard", () => {
  it("returns 4 LMS metrics", () => {
    const result = mapLmsDashboard(lmsSummary);
    expect(result.metrics).toHaveLength(4);
  });

  it("returns course completion trend", () => {
    const result = mapLmsDashboard(lmsSummary);
    expect(result.courseCompletionTrend[0].label).toBe("Jan");
  });

  it("returns top courses list", () => {
    const result = mapLmsDashboard(lmsSummary);
    expect(result.topCourses[0].title).toBe("Python");
    expect(result.topCourses[0].enrolled).toBe(420);
  });

  it("returns course distribution for chart", () => {
    const result = mapLmsDashboard(lmsSummary);
    expect(result.courseDistribution).toHaveLength(1);
    expect(result.courseDistribution[0].value).toBe(420);
  });
});

// ─── University mapper ────────────────────────────────────────────────────────

describe("mapUniversityDashboard", () => {
  it("returns 4 university metrics", () => {
    const result = mapUniversityDashboard(universitySummary);
    expect(result.metrics).toHaveLength(4);
  });

  it("returns enrollment trend", () => {
    const result = mapUniversityDashboard(universitySummary);
    expect(result.enrollmentTrend[0].value).toBe(8540);
  });

  it("returns department distribution chart data", () => {
    const result = mapUniversityDashboard(universitySummary);
    expect(result.departmentDistribution[0].label).toBe("Engineering");
  });

  it("returns upcoming events", () => {
    const result = mapUniversityDashboard(universitySummary);
    expect(result.upcomingEvents[0].type).toBe("academic");
  });
});
