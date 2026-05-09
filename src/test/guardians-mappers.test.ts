import { describe, it, expect } from "vitest";
import {
  guardianStatusToVariant,
  formatRelation,
  mapGuardiansToRows,
  buildGuardianStatusSummary,
  mapLinkedStudentsToRows,
} from "@/features/guardians/utils/guardian-mappers";
import type { Guardian } from "@/types/guardian";
import type { GuardianStudentLink } from "@/types/guardian";
import type { Student } from "@/types/student";
import type { ClassLevel, Section } from "@/types/academic";

// ─── guardianStatusToVariant ──────────────────────────────────────────────────

describe("guardianStatusToVariant", () => {
  it("maps active → active", () => {
    expect(guardianStatusToVariant("active")).toBe("active");
  });
  it("maps inactive → inactive", () => {
    expect(guardianStatusToVariant("inactive")).toBe("inactive");
  });
  it("maps pending → pending", () => {
    expect(guardianStatusToVariant("pending")).toBe("pending");
  });
  it("falls back to active for undefined", () => {
    expect(guardianStatusToVariant(undefined)).toBe("active");
  });
});

// ─── formatRelation ───────────────────────────────────────────────────────────

describe("formatRelation", () => {
  it("returns Father for father", () => {
    expect(formatRelation("father")).toBe("Father");
  });
  it("returns Mother for mother", () => {
    expect(formatRelation("mother")).toBe("Mother");
  });
  it("returns Legal Guardian for legal-guardian", () => {
    expect(formatRelation("legal-guardian")).toBe("Legal Guardian");
  });
  it("returns Other for other", () => {
    expect(formatRelation("other")).toBe("Other");
  });
});

// ─── Test fixtures ────────────────────────────────────────────────────────────

const makeGuardian = (overrides: Partial<Guardian> = {}): Guardian => ({
  id: "g-001",
  schoolId: "school-001",
  firstName: "Tariq",
  lastName: "Khan",
  relation: "father",
  occupation: "Engineer",
  nationalId: "12345",
  contact: {
    email: "tariq@example.com",
    phone: "+923001234567",
    alternatePhone: "",
  },
  address: {
    line1: "123 Main St",
    city: "Karachi",
    country: "Pakistan",
  },
  studentIds: ["s-001", "s-002"],
  status: "active",
  isEmergencyContact: true,
  portalAccess: true,
  audit: {
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    createdBy: "admin",
    updatedBy: "admin",
  },
  ...overrides,
});

// ─── mapGuardiansToRows ───────────────────────────────────────────────────────

describe("mapGuardiansToRows", () => {
  it("maps a guardian to a table row", () => {
    const g = makeGuardian();
    const rows = mapGuardiansToRows([g]);
    expect(rows).toHaveLength(1);
    const row = rows[0];
    expect(row.id).toBe("g-001");
    expect(row.fullName).toBe("Tariq Khan");
    expect(row.relation).toBe("father");
    expect(row.relationLabel).toBe("Father");
    expect(row.email).toBe("tariq@example.com");
    expect(row.phone).toBe("+923001234567");
    expect(row.linkedStudentCount).toBe(2);
    expect(row.portalAccess).toBe(true);
    expect(row.isEmergencyContact).toBe(true);
    expect(row.status).toBe("active");
    expect(row.statusVariant).toBe("active");
  });

  it("returns empty array for no guardians", () => {
    expect(mapGuardiansToRows([])).toHaveLength(0);
  });

  it("defaults status to active when not provided", () => {
    const g = makeGuardian({ status: undefined });
    const rows = mapGuardiansToRows([g]);
    expect(rows[0].status).toBe("active");
  });

  it("defaults portalAccess to false when not provided", () => {
    const g = makeGuardian({ portalAccess: undefined });
    const rows = mapGuardiansToRows([g]);
    expect(rows[0].portalAccess).toBe(false);
  });

  it("defaults isEmergencyContact to false when not provided", () => {
    const g = makeGuardian({ isEmergencyContact: undefined });
    const rows = mapGuardiansToRows([g]);
    expect(rows[0].isEmergencyContact).toBe(false);
  });
});

// ─── buildGuardianStatusSummary ───────────────────────────────────────────────

describe("buildGuardianStatusSummary", () => {
  const guardians = [
    makeGuardian({ id: "g-001", status: "active", isEmergencyContact: true, portalAccess: true }),
    makeGuardian({ id: "g-002", status: "active", isEmergencyContact: false, portalAccess: true }),
    makeGuardian({ id: "g-003", status: "inactive", isEmergencyContact: false, portalAccess: false }),
    makeGuardian({ id: "g-004", status: "pending", isEmergencyContact: true, portalAccess: false }),
  ];

  it("counts total correctly", () => {
    const summary = buildGuardianStatusSummary(guardians);
    expect(summary.total).toBe(4);
  });

  it("counts active correctly", () => {
    const summary = buildGuardianStatusSummary(guardians);
    expect(summary.active).toBe(2);
  });

  it("counts emergency contacts correctly", () => {
    const summary = buildGuardianStatusSummary(guardians);
    expect(summary.emergencyContacts).toBe(2);
  });

  it("counts portal access correctly", () => {
    const summary = buildGuardianStatusSummary(guardians);
    expect(summary.portalAccess).toBe(2);
  });

  it("returns zeros for empty array", () => {
    const summary = buildGuardianStatusSummary([]);
    expect(summary.total).toBe(0);
    expect(summary.active).toBe(0);
    expect(summary.emergencyContacts).toBe(0);
    expect(summary.portalAccess).toBe(0);
  });
});

// ─── mapLinkedStudentsToRows ──────────────────────────────────────────────────

describe("mapLinkedStudentsToRows", () => {
  const mockLink: GuardianStudentLink = {
    id: "link-001",
    guardianId: "g-001",
    studentId: "stu-001",
    relation: "father",
    isPrimary: true,
    audit: { createdAt: "", updatedAt: "", createdBy: "", updatedBy: "" },
  };

  const mockStudent: Student = {
    id: "stu-001",
    schoolId: "school-001",
    firstName: "Amir",
    lastName: "Khan",
    admissionNumber: "STU001",
    classId: "class-001",
    sectionId: "sec-001",
    guardianId: "g-001",
    dateOfBirth: "2010-01-01",
    gender: "male",
    status: "active",
    categoryId: "cat-001",
    rollNumber: "R001",
    nationality: "Pakistani",
    admissionDate: "2020-01-01",
    defaultCurrency: "PKR",
    contact: { email: "", phone: "" },
    address: { line1: "", city: "", country: "" },
    audit: { createdAt: "", updatedAt: "", createdBy: "", updatedBy: "" },
  };

  const mockClass: ClassLevel = {
    id: "class-001",
    schoolId: "school-001",
    name: "Class 5",
    order: 5,
    status: "active",
    audit: { createdAt: "", updatedAt: "", createdBy: "", updatedBy: "" },
  };

  const mockSection: Section = {
    id: "sec-001",
    schoolId: "school-001",
    classId: "class-001",
    name: "A",
    code: "5-A",
    capacity: 30,
    status: "active",
    audit: { createdAt: "", updatedAt: "", createdBy: "", updatedBy: "" },
  };

  it("maps a linked student to a row", () => {
    const rows = mapLinkedStudentsToRows([mockLink], [mockStudent], [mockClass], [mockSection]);
    expect(rows).toHaveLength(1);
    expect(rows[0].studentId).toBe("stu-001");
    expect(rows[0].fullName).toBe("Amir Khan");
    expect(rows[0].admissionNumber).toBe("STU001");
    expect(rows[0].className).toBe("Class 5");
    expect(rows[0].sectionName).toBe("A");
    expect(rows[0].isPrimary).toBe(true);
    expect(rows[0].status).toBe("active");
  });

  it("returns empty array when no links provided", () => {
    const rows = mapLinkedStudentsToRows([], [mockStudent], [mockClass], [mockSection]);
    expect(rows).toHaveLength(0);
  });

  it("falls back when student not found", () => {
    const rows = mapLinkedStudentsToRows([mockLink], [], [mockClass], [mockSection]);
    expect(rows[0].fullName).toBe("stu-001");
    expect(rows[0].admissionNumber).toBe("—");
  });
});
