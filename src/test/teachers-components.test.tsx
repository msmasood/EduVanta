/**
 * Teachers component tests — Phase 11
 */

import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { TeacherStatusCards } from "@/features/teachers/components/teacher-status-summary";
import { TeacherAttendanceGrid } from "@/features/teachers/components/teacher-attendance-grid";
import { TeacherInfoCard } from "@/features/teachers/components/teacher-info-card";
import { TeacherAcademicCard } from "@/features/teachers/components/teacher-academic-card";
import type { Teacher } from "@/types/teacher";
import type { AttendanceSummary } from "@/types/attendance";
import type { TeacherStatusSummary } from "@/features/teachers/utils/teacher-mappers";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const mockTeacher: Teacher = {
  id: "teacher-001",
  schoolId: "school-001",
  employeeCode: "TC001",
  firstName: "Amina",
  lastName: "Bukhari",
  dateOfBirth: "1985-03-15",
  gender: "female",
  designation: "Senior Teacher",
  departmentId: "dept-001",
  subjects: ["sub-001"],
  address: {
    line1: "123 Main St",
    line2: "",
    city: "Karachi",
    state: "Sindh",
    country: "Pakistan",
    postalCode: "75000",
  },
  contact: {
    email: "amina@school.edu",
    phone: "+923001234567",
    alternatePhone: "",
  },
  qualification: "M.Ed",
  experience: 10,
  joiningDate: "2018-01-01",
  status: "active",
  audit: {
    createdAt: "2018-01-01",
    updatedAt: "2024-01-01",
    createdBy: "admin",
    updatedBy: "admin",
  },
};

const mockSummary: TeacherStatusSummary = {
  total: 8,
  active: 7,
  onLeave: 1,
  departments: 4,
};

const mockAttendanceSummary: AttendanceSummary = {
  entityId: "teacher-001",
  entityType: "teacher",
  period: "2024-01",
  totalDays: 22,
  presentDays: 20,
  absentDays: 1,
  lateDays: 1,
  halfDays: 0,
  holidayDays: 0,
  leaveDays: 0,
  attendancePercentage: 90.9,
};

// ─── TeacherStatusCards ───────────────────────────────────────────────────────

describe("TeacherStatusCards", () => {
  it("renders Total Teachers card", () => {
    render(<TeacherStatusCards summary={mockSummary} />);
    expect(screen.getByText("Total Teachers")).toBeTruthy();
  });

  it("renders Active card", () => {
    render(<TeacherStatusCards summary={mockSummary} />);
    expect(screen.getByText("Active")).toBeTruthy();
  });

  it("renders On Leave card", () => {
    render(<TeacherStatusCards summary={mockSummary} />);
    expect(screen.getByText("On Leave")).toBeTruthy();
  });

  it("renders Departments card", () => {
    render(<TeacherStatusCards summary={mockSummary} />);
    expect(screen.getByText("Departments")).toBeTruthy();
  });

  it("shows correct total count", () => {
    render(<TeacherStatusCards summary={mockSummary} />);
    expect(screen.getByText("8")).toBeTruthy();
  });
});

// ─── TeacherAttendanceGrid ────────────────────────────────────────────────────

describe("TeacherAttendanceGrid", () => {
  it("renders attendance summary stats", () => {
    render(<TeacherAttendanceGrid summary={mockAttendanceSummary} />);
    expect(screen.getByText("Present")).toBeTruthy();
    expect(screen.getByText("Absent")).toBeTruthy();
    expect(screen.getByText("Late")).toBeTruthy();
    expect(screen.getByText("Leave")).toBeTruthy();
  });

  it("shows no records message when summary is null", () => {
    render(<TeacherAttendanceGrid summary={null} />);
    expect(screen.getByText(/No attendance records/i)).toBeTruthy();
  });

  it("shows attendance percentage", () => {
    render(<TeacherAttendanceGrid summary={mockAttendanceSummary} />);
    expect(screen.getByText(/90\.9% present/)).toBeTruthy();
  });
});

// ─── TeacherInfoCard ─────────────────────────────────────────────────────────

describe("TeacherInfoCard", () => {
  it("renders teacher email", () => {
    render(<TeacherInfoCard teacher={mockTeacher} />);
    expect(screen.getByText("amina@school.edu")).toBeTruthy();
  });

  it("renders teacher phone", () => {
    render(<TeacherInfoCard teacher={mockTeacher} />);
    expect(screen.getByText("+923001234567")).toBeTruthy();
  });

  it("renders qualification", () => {
    render(<TeacherInfoCard teacher={mockTeacher} />);
    expect(screen.getByText("M.Ed")).toBeTruthy();
  });
});

// ─── TeacherAcademicCard ─────────────────────────────────────────────────────

describe("TeacherAcademicCard", () => {
  it("renders department name", () => {
    render(
      <TeacherAcademicCard
        teacher={mockTeacher}
        departmentName="Mathematics"
        subjectNames={["Algebra", "Calculus"]}
      />
    );
    expect(screen.getByText("Mathematics")).toBeTruthy();
  });

  it("renders designation", () => {
    render(
      <TeacherAcademicCard
        teacher={mockTeacher}
        departmentName="Mathematics"
        subjectNames={[]}
      />
    );
    expect(screen.getByText("Senior Teacher")).toBeTruthy();
  });
});
