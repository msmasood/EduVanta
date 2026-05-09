import { describe, it, expect } from "vitest";
import {
  feePaymentSchema,
  feeGroupFormSchema,
  feeTypeFormSchema,
  feeDiscountFormSchema,
  feeInvoiceFilterSchema,
} from "@/lib/validations/fees";

// ─── feePaymentSchema ─────────────────────────────────────────────────────────

describe("feePaymentSchema", () => {
  const valid = {
    invoiceId: "inv-001",
    studentId: "stu-001",
    amount: 5000,
    currency: "PKR" as const,
    paymentMethod: "cash" as const,
    paymentDate: "2024-06-01",
  };

  it("accepts valid payment", () => {
    expect(feePaymentSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts all payment methods", () => {
    for (const method of ["cash", "bank-transfer", "online", "cheque"] as const) {
      expect(feePaymentSchema.safeParse({ ...valid, paymentMethod: method }).success).toBe(true);
    }
  });

  it("rejects empty invoiceId", () => {
    expect(feePaymentSchema.safeParse({ ...valid, invoiceId: "" }).success).toBe(false);
  });

  it("rejects empty studentId", () => {
    expect(feePaymentSchema.safeParse({ ...valid, studentId: "" }).success).toBe(false);
  });

  it("rejects negative amount", () => {
    expect(feePaymentSchema.safeParse({ ...valid, amount: -1 }).success).toBe(false);
  });

  it("accepts zero amount", () => {
    expect(feePaymentSchema.safeParse({ ...valid, amount: 0 }).success).toBe(true);
  });

  it("rejects unsupported currency", () => {
    expect(feePaymentSchema.safeParse({ ...valid, currency: "ZZZ" }).success).toBe(false);
  });

  it("rejects invalid payment method", () => {
    expect(feePaymentSchema.safeParse({ ...valid, paymentMethod: "crypto" }).success).toBe(false);
  });

  it("rejects empty paymentDate", () => {
    expect(feePaymentSchema.safeParse({ ...valid, paymentDate: "" }).success).toBe(false);
  });

  it("accepts optional referenceNumber and notes", () => {
    expect(feePaymentSchema.safeParse({ ...valid, referenceNumber: "TXN-123", notes: "Test" }).success).toBe(true);
  });
});

// ─── feeGroupFormSchema ───────────────────────────────────────────────────────

describe("feeGroupFormSchema", () => {
  const valid = {
    name: "Tuition Fees",
    code: "TUITION",
    status: "active" as const,
  };

  it("accepts valid group", () => {
    expect(feeGroupFormSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts with description", () => {
    expect(feeGroupFormSchema.safeParse({ ...valid, description: "All tuition" }).success).toBe(true);
  });

  it("rejects name shorter than 2 chars", () => {
    expect(feeGroupFormSchema.safeParse({ ...valid, name: "X" }).success).toBe(false);
  });

  it("rejects empty code", () => {
    expect(feeGroupFormSchema.safeParse({ ...valid, code: "" }).success).toBe(false);
  });

  it("rejects invalid status", () => {
    expect(feeGroupFormSchema.safeParse({ ...valid, status: "deleted" }).success).toBe(false);
  });

  it("accepts inactive status", () => {
    expect(feeGroupFormSchema.safeParse({ ...valid, status: "inactive" }).success).toBe(true);
  });

  it("accepts optional classIds array", () => {
    expect(feeGroupFormSchema.safeParse({ ...valid, classIds: ["cls-001"] }).success).toBe(true);
  });
});

// ─── feeTypeFormSchema ────────────────────────────────────────────────────────

describe("feeTypeFormSchema", () => {
  const valid = {
    name: "Monthly Tuition",
    code: "MONTHLY-TUI",
    amount: 5000,
    currency: "PKR" as const,
    frequency: "monthly" as const,
    status: "active" as const,
  };

  it("accepts valid fee type", () => {
    expect(feeTypeFormSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts all frequencies", () => {
    for (const frequency of ["monthly", "term", "annual", "one-time"] as const) {
      expect(feeTypeFormSchema.safeParse({ ...valid, frequency }).success).toBe(true);
    }
  });

  it("rejects name shorter than 2 chars", () => {
    expect(feeTypeFormSchema.safeParse({ ...valid, name: "X" }).success).toBe(false);
  });

  it("rejects empty code", () => {
    expect(feeTypeFormSchema.safeParse({ ...valid, code: "" }).success).toBe(false);
  });

  it("rejects negative amount", () => {
    expect(feeTypeFormSchema.safeParse({ ...valid, amount: -100 }).success).toBe(false);
  });

  it("accepts zero amount", () => {
    expect(feeTypeFormSchema.safeParse({ ...valid, amount: 0 }).success).toBe(true);
  });

  it("rejects invalid frequency", () => {
    expect(feeTypeFormSchema.safeParse({ ...valid, frequency: "weekly" }).success).toBe(false);
  });

  it("accepts optional groupId", () => {
    expect(feeTypeFormSchema.safeParse({ ...valid, groupId: "fg-001" }).success).toBe(true);
  });

  it("accepts dueDay in range 1–31", () => {
    expect(feeTypeFormSchema.safeParse({ ...valid, dueDay: 15 }).success).toBe(true);
    expect(feeTypeFormSchema.safeParse({ ...valid, dueDay: 1 }).success).toBe(true);
    expect(feeTypeFormSchema.safeParse({ ...valid, dueDay: 31 }).success).toBe(true);
  });

  it("rejects dueDay 0 or 32", () => {
    expect(feeTypeFormSchema.safeParse({ ...valid, dueDay: 0 }).success).toBe(false);
    expect(feeTypeFormSchema.safeParse({ ...valid, dueDay: 32 }).success).toBe(false);
  });
});

// ─── feeDiscountFormSchema ────────────────────────────────────────────────────

describe("feeDiscountFormSchema", () => {
  const valid = {
    name: "Merit Scholarship",
    code: "MERIT-100",
    discountType: "percentage" as const,
    value: 100,
    status: "active" as const,
  };

  it("accepts valid discount", () => {
    expect(feeDiscountFormSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts fixed discount", () => {
    expect(feeDiscountFormSchema.safeParse({ ...valid, discountType: "fixed", value: 1000 }).success).toBe(true);
  });

  it("rejects name shorter than 2 chars", () => {
    expect(feeDiscountFormSchema.safeParse({ ...valid, name: "X" }).success).toBe(false);
  });

  it("rejects empty code", () => {
    expect(feeDiscountFormSchema.safeParse({ ...valid, code: "" }).success).toBe(false);
  });

  it("rejects invalid discountType", () => {
    expect(feeDiscountFormSchema.safeParse({ ...valid, discountType: "amount" }).success).toBe(false);
  });

  it("rejects negative value", () => {
    expect(feeDiscountFormSchema.safeParse({ ...valid, value: -10 }).success).toBe(false);
  });

  it("accepts zero value", () => {
    expect(feeDiscountFormSchema.safeParse({ ...valid, value: 0 }).success).toBe(true);
  });

  it("accepts optional startDate and endDate", () => {
    expect(feeDiscountFormSchema.safeParse({ ...valid, startDate: "2024-01-01", endDate: "2024-12-31" }).success).toBe(true);
  });

  it("accepts optional applicableFeeTypeIds", () => {
    expect(feeDiscountFormSchema.safeParse({ ...valid, applicableFeeTypeIds: ["ft-001"] }).success).toBe(true);
  });
});

// ─── feeInvoiceFilterSchema ───────────────────────────────────────────────────

describe("feeInvoiceFilterSchema", () => {
  it("accepts empty filter", () => {
    expect(feeInvoiceFilterSchema.safeParse({}).success).toBe(true);
  });

  it("accepts all optional fields", () => {
    expect(feeInvoiceFilterSchema.safeParse({
      search: "Ahmad",
      status: "paid",
      feeGroupId: "fg-001",
    }).success).toBe(true);
  });
});
