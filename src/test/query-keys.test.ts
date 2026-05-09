import { describe, it, expect } from "vitest";
import { queryKeys } from "@/hooks/queries/query-keys";

describe("queryKeys", () => {
  // ─── Dashboard ──────────────────────────────────────────────────────────────
  describe("dashboard", () => {
    it("all key is stable", () => {
      expect(queryKeys.dashboard.all).toEqual(["dashboard"]);
    });
    it("summary key includes persona and schoolId", () => {
      const key = queryKeys.dashboard.summary("school", "school-001");
      expect(key).toContain("school");
      expect(key).toContain("school-001");
    });
    it("different personas produce different keys", () => {
      const k1 = queryKeys.dashboard.summary("school", "s1");
      const k2 = queryKeys.dashboard.summary("teacher", "s1");
      expect(k1).not.toEqual(k2);
    });
  });

  // ─── Students ───────────────────────────────────────────────────────────────
  describe("students", () => {
    it("list key with no params is stable", () => {
      expect(queryKeys.students.list()).toEqual(queryKeys.students.list());
    });
    it("list key with params differs from no params", () => {
      expect(queryKeys.students.list({ page: 1 })).not.toEqual(queryKeys.students.list());
    });
    it("detail key includes id", () => {
      expect(queryKeys.students.detail("student-001")).toContain("student-001");
    });
    it("different ids produce different keys", () => {
      expect(queryKeys.students.detail("a")).not.toEqual(queryKeys.students.detail("b"));
    });
    it("categories key is stable", () => {
      expect(queryKeys.students.categories()).toEqual(queryKeys.students.categories());
    });
  });

  // ─── Teachers ───────────────────────────────────────────────────────────────
  describe("teachers", () => {
    it("all keys exist", () => {
      expect(queryKeys.teachers.list()).toBeDefined();
      expect(queryKeys.teachers.detail("t1")).toBeDefined();
      expect(queryKeys.teachers.assignments("t1")).toBeDefined();
      expect(queryKeys.teachers.timetable("t1")).toBeDefined();
    });
    it("assignments key differs from timetable key for same id", () => {
      expect(queryKeys.teachers.assignments("t1")).not.toEqual(queryKeys.teachers.timetable("t1"));
    });
  });

  // ─── Employees ──────────────────────────────────────────────────────────────
  describe("employees", () => {
    it("departments key is stable", () => {
      expect(queryKeys.employees.departments()).toEqual(queryKeys.employees.departments());
    });
    it("designations key with deptId differs from without", () => {
      expect(queryKeys.employees.designations("d1")).not.toEqual(
        queryKeys.employees.designations(undefined)
      );
    });
  });

  // ─── Academic ───────────────────────────────────────────────────────────────
  describe("academic", () => {
    it("years with schoolId differs from without", () => {
      expect(queryKeys.academic.years("s1")).not.toEqual(queryKeys.academic.years(undefined));
    });
    it("classes, sections, subjects, classrooms exist", () => {
      expect(queryKeys.academic.classes()).toBeDefined();
      expect(queryKeys.academic.sections()).toBeDefined();
      expect(queryKeys.academic.subjects()).toBeDefined();
      expect(queryKeys.academic.classrooms()).toBeDefined();
    });
  });

  // ─── Fees ───────────────────────────────────────────────────────────────────
  describe("fees", () => {
    it("all fee keys exist", () => {
      expect(queryKeys.fees.groups()).toBeDefined();
      expect(queryKeys.fees.types()).toBeDefined();
      expect(queryKeys.fees.discounts()).toBeDefined();
      expect(queryKeys.fees.invoices()).toBeDefined();
      expect(queryKeys.fees.invoice("inv-001")).toBeDefined();
      expect(queryKeys.fees.studentInvoices("s-001")).toBeDefined();
      expect(queryKeys.fees.payments()).toBeDefined();
    });
    it("invoice key differs from payments key", () => {
      expect(queryKeys.fees.invoice("inv-001")).not.toEqual(queryKeys.fees.payments("inv-001"));
    });
  });

  // ─── Finance ────────────────────────────────────────────────────────────────
  describe("finance", () => {
    it("all finance keys exist", () => {
      expect(queryKeys.finance.incomeHeads()).toBeDefined();
      expect(queryKeys.finance.incomeRecords()).toBeDefined();
      expect(queryKeys.finance.expenseHeads()).toBeDefined();
      expect(queryKeys.finance.expenseRecords()).toBeDefined();
      expect(queryKeys.finance.transactions()).toBeDefined();
    });
  });

  // ─── Attendance ─────────────────────────────────────────────────────────────
  describe("attendance", () => {
    it("records key varies with entityType", () => {
      expect(queryKeys.attendance.records("student")).not.toEqual(
        queryKeys.attendance.records("teacher")
      );
    });
    it("entity key includes both entityId and entityType", () => {
      const key = queryKeys.attendance.entity("emp-001", "employee");
      expect(key).toContain("emp-001");
      expect(key).toContain("employee");
    });
  });

  // ─── Exams ──────────────────────────────────────────────────────────────────
  describe("exams", () => {
    it("grade scales key is stable", () => {
      expect(queryKeys.exams.gradeScales()).toEqual(queryKeys.exams.gradeScales());
    });
    it("schedules key includes examId", () => {
      expect(queryKeys.exams.schedules("exam-001")).toContain("exam-001");
    });
  });

  // ─── Library ────────────────────────────────────────────────────────────────
  describe("library", () => {
    it("overdue key is stable", () => {
      expect(queryKeys.library.overdue()).toEqual(queryKeys.library.overdue());
    });
    it("memberIssues key includes memberId", () => {
      expect(queryKeys.library.memberIssues("m-001")).toContain("m-001");
    });
  });

  // ─── Notifications ──────────────────────────────────────────────────────────
  describe("notifications", () => {
    it("user and unread keys differ", () => {
      expect(queryKeys.notifications.user("u1")).not.toEqual(
        queryKeys.notifications.unread("u1")
      );
    });
    it("unreadCount key exists", () => {
      expect(queryKeys.notifications.unreadCount("u1")).toBeDefined();
    });
  });

  // ─── Settings ───────────────────────────────────────────────────────────────
  describe("settings", () => {
    it("all settings keys are stable", () => {
      expect(queryKeys.settings.languages()).toEqual(queryKeys.settings.languages());
      expect(queryKeys.settings.currencies()).toEqual(queryKeys.settings.currencies());
      expect(queryKeys.settings.plans()).toEqual(queryKeys.settings.plans());
    });
  });

  // ─── Domain separation ──────────────────────────────────────────────────────
  describe("domain separation", () => {
    it("no two domains share the same top-level key", () => {
      const topKeys = [
        queryKeys.dashboard.all[0],
        queryKeys.schools.all[0],
        queryKeys.students.all[0],
        queryKeys.teachers.all[0],
        queryKeys.guardians.all[0],
        queryKeys.employees.all[0],
        queryKeys.academic.all[0],
        queryKeys.fees.all[0],
        queryKeys.finance.all[0],
        queryKeys.attendance.all[0],
        queryKeys.exams.all[0],
        queryKeys.leaves.all[0],
        queryKeys.library.all[0],
        queryKeys.communication.all[0],
        queryKeys.notifications.all[0],
        queryKeys.certificates.all[0],
        queryKeys.settings.all[0],
      ];
      expect(new Set(topKeys).size).toBe(topKeys.length);
    });
  });
});
