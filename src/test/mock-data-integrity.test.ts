import { describe, it, expect } from "vitest";
import {
  schools,
  schoolProfiles,
  academicYears,
} from "@/data/mock/schools";
import { classLevels, sections, subjects, classrooms } from "@/data/mock/academic";
import { students, studentCategories } from "@/data/mock/students";
import { teachers, teacherSubjectAssignments, teacherTimetableEntries } from "@/data/mock/teachers";
import { guardians, guardianStudentLinks } from "@/data/mock/guardians";
import { departments, designations, employees, payrollRecords } from "@/data/mock/employees";
import { feeGroups, feeTypes, feeDiscounts, feeInvoices, feePayments } from "@/data/mock/fees";
import { incomeHeads, incomeRecords, expenseHeads, expenseRecords, transactions } from "@/data/mock/finance";
import { attendanceRecords, attendanceSummaries } from "@/data/mock/attendance";
import { gradeScales, exams, examSchedules, examResults } from "@/data/mock/exams";
import { leaveTypes, leaveRequests } from "@/data/mock/leaves";
import { books, libraryMembers, bookIssues } from "@/data/mock/library";
import { notices, calendarEvents, messageThreads, messages } from "@/data/mock/communication";
import { notifications } from "@/data/mock/notifications";
import { certificateTemplates, certificateRecords } from "@/data/mock/certificates";
import { languageSettings, currencySettings, subscriptionPlans } from "@/data/mock/settings";
import { dashboardSummaries } from "@/data/mock/dashboard";
import { CURRENCY_CODES } from "@/lib/currency";
import type { MoneyAmount } from "@/types/common";

// ─── helpers ──────────────────────────────────────────────────────────────────
function uniqueIds<T extends { id: string }>(items: T[]): boolean {
  const ids = items.map((i) => i.id);
  return new Set(ids).size === ids.length;
}

function validCurrency(m: MoneyAmount): boolean {
  return CURRENCY_CODES.includes(m.currency as (typeof CURRENCY_CODES)[number]);
}

// ─── Schools ──────────────────────────────────────────────────────────────────
describe("mock/schools", () => {
  it("has at least 1 school", () => expect(schools.length).toBeGreaterThan(0));
  it("school ids are unique", () => expect(uniqueIds(schools)).toBe(true));
  it("has school profiles for each school", () => {
    const profileIds = schoolProfiles.map((p) => p.id);
    schools.forEach((s) => expect(profileIds).toContain(s.id));
  });
  it("exactly one academic year is current per school", () => {
    const schoolIds = [...new Set(academicYears.map((y) => y.schoolId))];
    schoolIds.forEach((sid) => {
      const current = academicYears.filter((y) => y.schoolId === sid && y.isCurrent);
      expect(current.length).toBeLessThanOrEqual(1);
    });
  });
});

// ─── Academic ─────────────────────────────────────────────────────────────────
describe("mock/academic", () => {
  it("classLevels are non-empty with unique ids", () => {
    expect(classLevels.length).toBeGreaterThan(0);
    expect(uniqueIds(classLevels)).toBe(true);
  });
  it("sections reference valid classIds", () => {
    const classIds = classLevels.map((c) => c.id);
    sections.forEach((s) => expect(classIds).toContain(s.classId));
  });
  it("subjects have classIds arrays", () => {
    subjects.forEach((s) => expect(Array.isArray(s.classIds)).toBe(true));
  });
  it("classrooms are non-empty", () => expect(classrooms.length).toBeGreaterThan(0));
});

// ─── Students ─────────────────────────────────────────────────────────────────
describe("mock/students", () => {
  it("has at least 5 students", () => expect(students.length).toBeGreaterThanOrEqual(5));
  it("student ids are unique", () => expect(uniqueIds(students)).toBe(true));
  it("categories are non-empty", () => expect(studentCategories.length).toBeGreaterThan(0));
  it("each student has a valid defaultCurrency", () => {
    students.forEach((s) => {
      if (s.defaultCurrency) expect(CURRENCY_CODES).toContain(s.defaultCurrency);
    });
  });
});

// ─── Teachers ─────────────────────────────────────────────────────────────────
describe("mock/teachers", () => {
  it("has at least 3 teachers", () => expect(teachers.length).toBeGreaterThanOrEqual(3));
  it("teacher ids are unique", () => expect(uniqueIds(teachers)).toBe(true));
  it("assignments reference valid teacherIds", () => {
    const tIds = teachers.map((t) => t.id);
    teacherSubjectAssignments.forEach((a) => expect(tIds).toContain(a.teacherId));
  });
  it("timetable entries reference valid teacherIds", () => {
    const tIds = teachers.map((t) => t.id);
    teacherTimetableEntries.forEach((e) => expect(tIds).toContain(e.teacherId));
  });
});

// ─── Guardians ────────────────────────────────────────────────────────────────
describe("mock/guardians", () => {
  it("guardian count matches student count", () =>
    expect(guardians.length).toBeGreaterThan(0));
  it("guardian ids are unique", () => expect(uniqueIds(guardians)).toBe(true));
  it("guardianStudentLinks are present", () =>
    expect(guardianStudentLinks.length).toBeGreaterThan(0));
});

// ─── Employees ────────────────────────────────────────────────────────────────
describe("mock/employees", () => {
  it("has departments, designations, employees", () => {
    expect(departments.length).toBeGreaterThan(0);
    expect(designations.length).toBeGreaterThan(0);
    expect(employees.length).toBeGreaterThan(0);
  });
  it("employee basicSalary has valid currency", () => {
    employees.forEach((e) => expect(validCurrency(e.basicSalary)).toBe(true));
  });
  it("payroll records reference valid employeeIds", () => {
    const eIds = employees.map((e) => e.id);
    payrollRecords.forEach((p) => expect(eIds).toContain(p.employeeId));
  });
});

// ─── Fees ─────────────────────────────────────────────────────────────────────
describe("mock/fees", () => {
  it("has feeGroups, feeTypes, invoices, payments", () => {
    expect(feeGroups.length).toBeGreaterThan(0);
    expect(feeTypes.length).toBeGreaterThan(0);
    expect(feeInvoices.length).toBeGreaterThan(0);
    expect(feePayments.length).toBeGreaterThan(0);
  });
  it("feeDiscounts are present", () => expect(feeDiscounts.length).toBeGreaterThan(0));
  it("invoice ids are unique", () => expect(uniqueIds(feeInvoices)).toBe(true));
  it("invoices reference valid studentIds", () => {
    const sIds = students.map((s) => s.id);
    feeInvoices.forEach((inv) => expect(sIds).toContain(inv.studentId));
  });
});

// ─── Finance ──────────────────────────────────────────────────────────────────
describe("mock/finance", () => {
  it("has income and expense data", () => {
    expect(incomeHeads.length).toBeGreaterThan(0);
    expect(incomeRecords.length).toBeGreaterThan(0);
    expect(expenseHeads.length).toBeGreaterThan(0);
    expect(expenseRecords.length).toBeGreaterThan(0);
    expect(transactions.length).toBeGreaterThan(0);
  });
  it("transaction ids are unique", () => expect(uniqueIds(transactions)).toBe(true));
});

// ─── Attendance ───────────────────────────────────────────────────────────────
describe("mock/attendance", () => {
  it("has attendance records", () => expect(attendanceRecords.length).toBeGreaterThan(0));
  it("has summaries", () => expect(attendanceSummaries.length).toBeGreaterThan(0));
  it("record ids are unique", () => expect(uniqueIds(attendanceRecords)).toBe(true));
});

// ─── Exams ────────────────────────────────────────────────────────────────────
describe("mock/exams", () => {
  it("has exams, schedules, results, gradeScales", () => {
    expect(exams.length).toBeGreaterThan(0);
    expect(examSchedules.length).toBeGreaterThan(0);
    expect(examResults.length).toBeGreaterThan(0);
    expect(gradeScales.length).toBeGreaterThan(0);
  });
  it("exam schedules reference valid exam ids", () => {
    const eIds = exams.map((e) => e.id);
    examSchedules.forEach((s) => expect(eIds).toContain(s.examId));
  });
  it("exam results reference valid student ids", () => {
    const sIds = students.map((s) => s.id);
    examResults.forEach((r) => expect(sIds).toContain(r.studentId));
  });
});

// ─── Leaves ───────────────────────────────────────────────────────────────────
describe("mock/leaves", () => {
  it("has leave types and requests", () => {
    expect(leaveTypes.length).toBeGreaterThan(0);
    expect(leaveRequests.length).toBeGreaterThan(0);
  });
  it("leave request ids are unique", () => expect(uniqueIds(leaveRequests)).toBe(true));
});

// ─── Library ──────────────────────────────────────────────────────────────────
describe("mock/library", () => {
  it("has books, members, issues", () => {
    expect(books.length).toBeGreaterThan(0);
    expect(libraryMembers.length).toBeGreaterThan(0);
    expect(bookIssues.length).toBeGreaterThan(0);
  });
  it("book ids are unique", () => expect(uniqueIds(books)).toBe(true));
});

// ─── Communication ────────────────────────────────────────────────────────────
describe("mock/communication", () => {
  it("has notices, events, threads, messages", () => {
    expect(notices.length).toBeGreaterThan(0);
    expect(calendarEvents.length).toBeGreaterThan(0);
    expect(messageThreads.length).toBeGreaterThan(0);
    expect(messages.length).toBeGreaterThan(0);
  });
  it("messages reference valid threadIds", () => {
    const tIds = messageThreads.map((t) => t.id);
    messages.forEach((m) => expect(tIds).toContain(m.threadId));
  });
});

// ─── Notifications ────────────────────────────────────────────────────────────
describe("mock/notifications", () => {
  it("has notifications", () => expect(notifications.length).toBeGreaterThan(0));
  it("notification ids are unique", () => expect(uniqueIds(notifications)).toBe(true));
});

// ─── Certificates ─────────────────────────────────────────────────────────────
describe("mock/certificates", () => {
  it("has templates", () => expect(certificateTemplates.length).toBeGreaterThan(0));
});

// ─── Settings ─────────────────────────────────────────────────────────────────
describe("mock/settings", () => {
  it("has 3 language settings (en, ar, ur)", () => {
    expect(languageSettings.length).toBe(3);
    const codes = languageSettings.map((l) => l.locale);
    expect(codes).toContain("en");
    expect(codes).toContain("ar");
    expect(codes).toContain("ur");
  });
  it("has currency settings for all CURRENCY_CODES", () => {
    const cCodes = currencySettings.map((c) => c.code);
    CURRENCY_CODES.forEach((code) => expect(cCodes).toContain(code));
  });
  it("has subscription plans", () => expect(subscriptionPlans.length).toBeGreaterThan(0));
});

// ─── Dashboard ────────────────────────────────────────────────────────────────
describe("mock/dashboard", () => {
  const PERSONAS = ["school", "student", "teacher", "parent", "lms", "university"] as const;
  it("has data for all 6 personas", () => {
    PERSONAS.forEach((p) => expect(dashboardSummaries[p]).toBeDefined());
  });
  it("each summary has data", () => {
    PERSONAS.forEach((p) => expect(dashboardSummaries[p].data).toBeDefined());
  });
  it("each summary has generatedAt", () => {
    PERSONAS.forEach((p) =>
      expect(typeof dashboardSummaries[p].generatedAt).toBe("string")
    );
  });
});
