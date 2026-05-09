import { describe, it, expect } from "vitest";
import {
  invoiceStatusToVariant,
  invoiceStatusLabel,
  mapInvoicesToRows,
  computeInvoiceSummary,
  mapFeeGroupsToRows,
  mapFeeTypesToRows,
  mapFeeDiscountsToRows,
} from "@/features/fees/utils/fee-mappers";
import type { FeeInvoice, FeeGroup, FeeType, FeeDiscount } from "@/types/fees";
import type { Student } from "@/types/student";

const audit = { createdAt: "2024-01-01T00:00:00.000Z", updatedAt: "2024-01-01T00:00:00.000Z" };

// ─── invoiceStatusToVariant ───────────────────────────────────────────────────

describe("invoiceStatusToVariant", () => {
  it("maps paid → paid", () => expect(invoiceStatusToVariant("paid")).toBe("paid"));
  it("maps partial → partial", () => expect(invoiceStatusToVariant("partial")).toBe("partial"));
  it("maps overdue → overdue", () => expect(invoiceStatusToVariant("overdue")).toBe("overdue"));
  it("maps due → due", () => expect(invoiceStatusToVariant("due")).toBe("due"));
  it("maps waived → neutral", () => expect(invoiceStatusToVariant("waived")).toBe("neutral"));
  it("maps cancelled → inactive", () => expect(invoiceStatusToVariant("cancelled")).toBe("inactive"));
  it("maps pending → pending", () => expect(invoiceStatusToVariant("pending")).toBe("pending"));
  it("defaults unknown → neutral", () => expect(invoiceStatusToVariant("xyz")).toBe("neutral"));
});

// ─── invoiceStatusLabel ───────────────────────────────────────────────────────

describe("invoiceStatusLabel", () => {
  it("returns Paid", () => expect(invoiceStatusLabel("paid")).toBe("Paid"));
  it("returns Partial", () => expect(invoiceStatusLabel("partial")).toBe("Partial"));
  it("returns Overdue", () => expect(invoiceStatusLabel("overdue")).toBe("Overdue"));
  it("returns Due", () => expect(invoiceStatusLabel("due")).toBe("Due"));
  it("returns Waived", () => expect(invoiceStatusLabel("waived")).toBe("Waived"));
  it("returns Cancelled", () => expect(invoiceStatusLabel("cancelled")).toBe("Cancelled"));
  it("returns Pending", () => expect(invoiceStatusLabel("pending")).toBe("Pending"));
});

// ─── mapInvoicesToRows ────────────────────────────────────────────────────────

describe("mapInvoicesToRows", () => {
  const student: Student = {
    id: "stu-001",
    schoolId: "school-001",
    firstName: "Ahmad",
    lastName: "Khan",
    admissionNumber: "ADM-001",
    dateOfBirth: "2005-03-15",
    gender: "male",
    categoryId: "cat-001",
    classId: "cls-001",
    sectionId: "sec-001",
    rollNumber: "R001",
    address: { line1: "123 Street", city: "Karachi", country: "Pakistan" },
    contact: { email: "ahmad@example.com", phone: "03001234567" },
    guardianId: "grd-001",
    nationality: "Pakistani",
    status: "active",
    admissionDate: "2022-04-01",
    defaultCurrency: "PKR",
    audit,
  };

  const feeGroup: FeeGroup = {
    id: "fg-001",
    schoolId: "school-001",
    name: "Tuition",
    audit,
  };

  const feeType: FeeType = {
    id: "ft-001",
    schoolId: "school-001",
    feeGroupId: "fg-001",
    name: "Monthly Fee",
    amount: { amount: 5000, currency: "PKR" },
    isRecurring: true,
    frequency: "monthly",
    audit,
  };

  const invoice: FeeInvoice = {
    id: "inv-001",
    schoolId: "school-001",
    studentId: "stu-001",
    feeTypeId: "ft-001",
    invoiceNumber: "INV-2024-001",
    amount: { amount: 5000, currency: "PKR" },
    discountAmount: { amount: 0, currency: "PKR" },
    netAmount: { amount: 5000, currency: "PKR" },
    dueDate: "2024-06-30",
    paidAmount: { amount: 5000, currency: "PKR" },
    status: "paid",
    academicYearId: "ay-001",
    audit,
  };

  it("maps a paid invoice to a row correctly", () => {
    const rows = mapInvoicesToRows([invoice], [student], [feeType], [feeGroup]);
    expect(rows).toHaveLength(1);
    const row = rows[0];
    expect(row.id).toBe("inv-001");
    expect(row.invoiceNumber).toBe("INV-2024-001");
    expect(row.studentName).toBe("Ahmad Khan");
    expect(row.admissionNumber).toBe("ADM-001");
    expect(row.feeTypeName).toBe("Monthly Fee");
    expect(row.feeGroupName).toBe("Tuition");
    expect(row.netAmount).toBe(5000);
    expect(row.paidAmount).toBe(5000);
    expect(row.balance).toBe(0);
    expect(row.status).toBe("paid");
    expect(row.statusVariant).toBe("paid");
    expect(row.statusLabel).toBe("Paid");
  });

  it("computes correct balance for partial payment", () => {
    const partial: FeeInvoice = {
      ...invoice,
      id: "inv-002",
      status: "partial",
      paidAmount: { amount: 2000, currency: "PKR" },
    };
    const rows = mapInvoicesToRows([partial], [student], [feeType], [feeGroup]);
    expect(rows[0].balance).toBe(3000);
  });

  it("handles missing student gracefully", () => {
    const rows = mapInvoicesToRows([invoice], [], [feeType], [feeGroup]);
    expect(rows[0].studentName).toBe("stu-001");
    expect(rows[0].admissionNumber).toBe("");
  });

  it("handles missing fee type gracefully", () => {
    const rows = mapInvoicesToRows([invoice], [student], [], [feeGroup]);
    expect(rows[0].feeTypeName).toBe("ft-001");
    expect(rows[0].feeGroupName).toBe("");
  });
});

// ─── computeInvoiceSummary ────────────────────────────────────────────────────

describe("computeInvoiceSummary", () => {
  const makeInvoice = (
    id: string,
    net: number,
    paid: number,
    status: "paid" | "partial" | "due" | "overdue" | "waived"
  ): FeeInvoice => ({
    id,
    schoolId: "school-001",
    studentId: "stu-001",
    feeTypeId: "ft-001",
    invoiceNumber: `INV-${id}`,
    amount: { amount: net, currency: "PKR" },
    discountAmount: { amount: 0, currency: "PKR" },
    netAmount: { amount: net, currency: "PKR" },
    dueDate: "2024-06-30",
    paidAmount: { amount: paid, currency: "PKR" },
    status,
    academicYearId: "ay-001",
    audit,
  });

  it("computes totals from mixed invoices", () => {
    const invoices = [
      makeInvoice("a", 10000, 10000, "paid"),
      makeInvoice("b", 5000, 0, "overdue"),
      makeInvoice("c", 3000, 0, "due"),
    ];
    const s = computeInvoiceSummary(invoices);
    expect(s.totalInvoiced).toBe(18000);
    expect(s.collected).toBe(10000);
    expect(s.overdue).toBe(5000);
    expect(s.pending).toBe(3000);
  });

  it("returns zero totals for empty invoice list", () => {
    const s = computeInvoiceSummary([]);
    expect(s.totalInvoiced).toBe(0);
    expect(s.collected).toBe(0);
    expect(s.overdue).toBe(0);
    expect(s.pending).toBe(0);
  });
});

// ─── mapFeeGroupsToRows ───────────────────────────────────────────────────────

describe("mapFeeGroupsToRows", () => {
  const groups: FeeGroup[] = [
    { id: "fg-001", schoolId: "s1", name: "Tuition", audit },
    { id: "fg-002", schoolId: "s1", name: "Exam", description: "Exam fees", audit },
  ];

  const types: FeeType[] = [
    { id: "ft-001", schoolId: "s1", feeGroupId: "fg-001", name: "Monthly", amount: { amount: 5000, currency: "PKR" }, isRecurring: true, audit },
    { id: "ft-002", schoolId: "s1", feeGroupId: "fg-001", name: "Annual", amount: { amount: 2000, currency: "PKR" }, isRecurring: false, audit },
    { id: "ft-003", schoolId: "s1", feeGroupId: "fg-002", name: "Exam Fee", amount: { amount: 1000, currency: "PKR" }, isRecurring: false, audit },
  ];

  it("counts fee types per group", () => {
    const rows = mapFeeGroupsToRows(groups, types);
    expect(rows).toHaveLength(2);
    expect(rows.find((r) => r.id === "fg-001")?.feeTypesCount).toBe(2);
    expect(rows.find((r) => r.id === "fg-002")?.feeTypesCount).toBe(1);
  });

  it("maps description correctly", () => {
    const rows = mapFeeGroupsToRows(groups, types);
    expect(rows.find((r) => r.id === "fg-001")?.description).toBe("");
    expect(rows.find((r) => r.id === "fg-002")?.description).toBe("Exam fees");
  });
});

// ─── mapFeeTypesToRows ────────────────────────────────────────────────────────

describe("mapFeeTypesToRows", () => {
  const groups: FeeGroup[] = [
    { id: "fg-001", schoolId: "s1", name: "Tuition", audit },
  ];

  const types: FeeType[] = [
    { id: "ft-001", schoolId: "s1", feeGroupId: "fg-001", name: "Monthly Fee", amount: { amount: 5000, currency: "PKR" }, isRecurring: true, frequency: "monthly", audit },
    { id: "ft-002", schoolId: "s1", feeGroupId: "fg-999", name: "Orphan Fee", amount: { amount: 100, currency: "USD" }, isRecurring: false, audit },
  ];

  it("maps fee types with group names", () => {
    const rows = mapFeeTypesToRows(types, groups);
    expect(rows[0].groupName).toBe("Tuition");
    expect(rows[0].amount).toBe(5000);
    expect(rows[0].currency).toBe("PKR");
    expect(rows[0].frequency).toBe("monthly");
    expect(rows[0].isRecurring).toBe(true);
  });

  it("uses empty string for missing group", () => {
    const rows = mapFeeTypesToRows(types, groups);
    expect(rows[1].groupName).toBe("");
  });
});

// ─── mapFeeDiscountsToRows ────────────────────────────────────────────────────

describe("mapFeeDiscountsToRows", () => {
  const types: FeeType[] = [
    { id: "ft-001", schoolId: "s1", feeGroupId: "fg-001", name: "Monthly", amount: { amount: 5000, currency: "PKR" }, isRecurring: true, audit },
    { id: "ft-002", schoolId: "s1", feeGroupId: "fg-001", name: "Annual", amount: { amount: 2000, currency: "PKR" }, isRecurring: false, audit },
  ];

  const discounts: FeeDiscount[] = [
    { id: "fd-001", schoolId: "s1", name: "Scholarship", discountType: "percentage", value: 100, audit },
    { id: "fd-002", schoolId: "s1", name: "Sibling", discountType: "fixed", value: 1000, applicableTo: ["ft-001", "ft-002"], audit },
  ];

  it("formats percentage value as 100%", () => {
    const rows = mapFeeDiscountsToRows(discounts, types);
    expect(rows[0].valueDisplay).toBe("100%");
    expect(rows[0].discountType).toBe("percentage");
  });

  it("formats fixed value without currency symbol", () => {
    const rows = mapFeeDiscountsToRows(discounts, types);
    expect(rows[1].valueDisplay).toBe("1000");
    expect(rows[1].discountType).toBe("fixed");
  });

  it("counts applicable fee types", () => {
    const rows = mapFeeDiscountsToRows(discounts, types);
    expect(rows[0].applicableCount).toBe(0); // no applicableTo set
    expect(rows[1].applicableCount).toBe(2);
  });
});
