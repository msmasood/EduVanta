import { describe, it, expect } from "vitest";
import {
  incomeHeadFormSchema,
  incomeFormSchema,
  expenseHeadFormSchema,
  expenseFormSchema,
  transactionFilterSchema,
} from "@/lib/validations/finance";

describe("Finance Validation Schemas", () => {
  // ── Income Head ──────────────────────────────────────────────────────────
  describe("incomeHeadFormSchema", () => {
    it("passes with valid income head data", () => {
      const result = incomeHeadFormSchema.safeParse({
        name: "Fee Revenue",
        code: "IH-FEE",
        description: "All fee-related income",
        status: "active",
      });
      expect(result.success).toBe(true);
    });

    it("fails when name is missing", () => {
      const result = incomeHeadFormSchema.safeParse({
        code: "IH-FEE",
        status: "active",
      });
      expect(result.success).toBe(false);
    });

    it("fails when name is too short", () => {
      const result = incomeHeadFormSchema.safeParse({
        name: "A",
        code: "IH-FEE",
        status: "active",
      });
      expect(result.success).toBe(false);
    });

    it("fails when code is missing", () => {
      const result = incomeHeadFormSchema.safeParse({
        name: "Fee Revenue",
        status: "active",
      });
      expect(result.success).toBe(false);
    });

    it("passes without optional description", () => {
      const result = incomeHeadFormSchema.safeParse({
        name: "Fee Revenue",
        code: "IH-FEE",
        status: "active",
      });
      expect(result.success).toBe(true);
    });
  });

  // ── Income Form ──────────────────────────────────────────────────────────
  describe("incomeFormSchema", () => {
    it("passes with valid income record data", () => {
      const result = incomeFormSchema.safeParse({
        incomeHeadId: "ih-001",
        title: "Annual Donation",
        amount: 50000,
        currency: "PKR",
        paymentMethod: "bank-transfer",
        incomeDate: "2024-07-15",
        status: "received",
      });
      expect(result.success).toBe(true);
    });

    it("fails when amount is negative", () => {
      const result = incomeFormSchema.safeParse({
        incomeHeadId: "ih-001",
        title: "Annual Donation",
        amount: -100,
        currency: "PKR",
        paymentMethod: "cash",
        incomeDate: "2024-07-15",
        status: "received",
      });
      expect(result.success).toBe(false);
    });

    it("fails when currency is unsupported", () => {
      const result = incomeFormSchema.safeParse({
        incomeHeadId: "ih-001",
        title: "Annual Donation",
        amount: 50000,
        currency: "JPY",
        paymentMethod: "cash",
        incomeDate: "2024-07-15",
        status: "received",
      });
      expect(result.success).toBe(false);
    });

    it("passes with amount zero", () => {
      const result = incomeFormSchema.safeParse({
        incomeHeadId: "ih-001",
        title: "Zero Entry",
        amount: 0,
        currency: "USD",
        paymentMethod: "cash",
        incomeDate: "2024-07-15",
        status: "pending",
      });
      expect(result.success).toBe(true);
    });

    it("fails when incomeHeadId is missing", () => {
      const result = incomeFormSchema.safeParse({
        title: "Annual Donation",
        amount: 50000,
        currency: "PKR",
        paymentMethod: "cash",
        incomeDate: "2024-07-15",
        status: "received",
      });
      expect(result.success).toBe(false);
    });
  });

  // ── Expense Head ─────────────────────────────────────────────────────────
  describe("expenseHeadFormSchema", () => {
    it("passes with valid expense head data", () => {
      const result = expenseHeadFormSchema.safeParse({
        name: "Staff Salaries",
        code: "EH-SAL",
        status: "active",
      });
      expect(result.success).toBe(true);
    });

    it("fails when code is missing", () => {
      const result = expenseHeadFormSchema.safeParse({
        name: "Staff Salaries",
        status: "active",
      });
      expect(result.success).toBe(false);
    });
  });

  // ── Expense Form ─────────────────────────────────────────────────────────
  describe("expenseFormSchema", () => {
    it("passes with valid expense data", () => {
      const result = expenseFormSchema.safeParse({
        expenseHeadId: "eh-001",
        title: "October Electricity Bill",
        amount: 18500,
        currency: "PKR",
        paymentMethod: "bank-transfer",
        expenseDate: "2024-10-03",
        status: "paid",
      });
      expect(result.success).toBe(true);
    });

    it("fails when amount is negative", () => {
      const result = expenseFormSchema.safeParse({
        expenseHeadId: "eh-001",
        title: "Electricity Bill",
        amount: -500,
        currency: "PKR",
        paymentMethod: "cash",
        expenseDate: "2024-10-03",
        status: "paid",
      });
      expect(result.success).toBe(false);
    });

    it("fails when title is too short", () => {
      const result = expenseFormSchema.safeParse({
        expenseHeadId: "eh-001",
        title: "X",
        amount: 100,
        currency: "USD",
        paymentMethod: "cash",
        expenseDate: "2024-10-03",
        status: "paid",
      });
      expect(result.success).toBe(false);
    });
  });

  // ── Transaction Filter ───────────────────────────────────────────────────
  describe("transactionFilterSchema", () => {
    it("passes with empty filter", () => {
      const result = transactionFilterSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it("passes with valid date range", () => {
      const result = transactionFilterSchema.safeParse({
        dateFrom: "2024-01-01",
        dateTo: "2024-12-31",
      });
      expect(result.success).toBe(true);
    });

    it("fails when dateTo is before dateFrom", () => {
      const result = transactionFilterSchema.safeParse({
        dateFrom: "2024-12-31",
        dateTo: "2024-01-01",
      });
      expect(result.success).toBe(false);
    });

    it("passes when only dateFrom is set", () => {
      const result = transactionFilterSchema.safeParse({
        dateFrom: "2024-01-01",
      });
      expect(result.success).toBe(true);
    });
  });
});
