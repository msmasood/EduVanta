import { describe, it, expect } from "vitest";
import {
  mapIncomeHeadsToRows,
  mapIncomeRecordsToRows,
  mapExpenseHeadsToRows,
  mapExpenseRecordsToRows,
  mapTransactionsToRows,
  headStatusToVariant,
  incomeStatusToVariant,
  expenseStatusToVariant,
  transactionStatusToVariant,
  transactionTypeVariant,
  paymentMethodLabel,
} from "@/features/finance/utils/finance-mappers";
import {
  computeFinanceSummary,
  computeHeadSummary,
  computeTransactionSummary,
} from "@/features/finance/utils/finance-calculations";
import type { IncomeHead, IncomeRecord, ExpenseHead, ExpenseRecord, Transaction } from "@/types/finance";

// ── Mock Data ─────────────────────────────────────────────────────────────

const mockIncomeHeads: IncomeHead[] = [
  {
    id: "ih-001",
    schoolId: "s1",
    name: "Fee Revenue",
    code: "IH-FEE",
    status: "active",
    audit: { createdAt: "", updatedAt: "" },
  },
  {
    id: "ih-002",
    schoolId: "s1",
    name: "Donations",
    code: "IH-DON",
    status: "inactive",
    audit: { createdAt: "", updatedAt: "" },
  },
];

const mockIncomeRecords: IncomeRecord[] = [
  {
    id: "ir-001",
    schoolId: "s1",
    incomeHeadId: "ih-001",
    invoiceNumber: "INC-001",
    title: "Q1 Fee Revenue",
    amount: { amount: 50000, currency: "PKR" },
    date: "2024-07-01",
    paymentMethod: "bank-transfer",
    collectedBy: "emp-001",
    status: "received",
    audit: { createdAt: "", updatedAt: "" },
  },
  {
    id: "ir-002",
    schoolId: "s1",
    incomeHeadId: "ih-001",
    invoiceNumber: "INC-002",
    title: "Q2 Fee Revenue",
    amount: { amount: 30000, currency: "PKR" },
    date: "2024-08-01",
    paymentMethod: "cash",
    collectedBy: "emp-001",
    status: "pending",
    audit: { createdAt: "", updatedAt: "" },
  },
];

const mockExpenseHeads: ExpenseHead[] = [
  {
    id: "eh-001",
    schoolId: "s1",
    name: "Staff Salaries",
    code: "EH-SAL",
    status: "active",
    audit: { createdAt: "", updatedAt: "" },
  },
];

const mockExpenseRecords: ExpenseRecord[] = [
  {
    id: "er-001",
    schoolId: "s1",
    expenseHeadId: "eh-001",
    invoiceNumber: "EXP-001",
    title: "October Salaries",
    amount: { amount: 100000, currency: "PKR" },
    date: "2024-10-01",
    paymentMethod: "bank-transfer",
    approvedBy: "emp-001",
    status: "paid",
    audit: { createdAt: "", updatedAt: "" },
  },
];

const mockTransactions: Transaction[] = [
  {
    id: "txn-001",
    schoolId: "s1",
    type: "income",
    referenceId: "ir-001",
    referenceType: "IncomeRecord",
    amount: { amount: 50000, currency: "PKR" },
    description: "Q1 income",
    date: "2024-07-01",
    paymentMethod: "bank-transfer",
    status: "completed",
    audit: { createdAt: "", updatedAt: "" },
  },
  {
    id: "txn-002",
    schoolId: "s1",
    type: "expense",
    referenceId: "er-001",
    referenceType: "ExpenseRecord",
    amount: { amount: 100000, currency: "PKR" },
    description: "October expenses",
    date: "2024-10-01",
    paymentMethod: "bank-transfer",
    status: "pending",
    audit: { createdAt: "", updatedAt: "" },
  },
];

// ── Status Variant Mappers ────────────────────────────────────────────────

describe("Status Variant Mappers", () => {
  it("headStatusToVariant maps active and inactive", () => {
    expect(headStatusToVariant("active")).toBe("active");
    expect(headStatusToVariant("inactive")).toBe("inactive");
    expect(headStatusToVariant(undefined)).toBe("active");
  });

  it("incomeStatusToVariant maps correctly", () => {
    expect(incomeStatusToVariant("received")).toBe("paid");
    expect(incomeStatusToVariant("pending")).toBe("pending");
    expect(incomeStatusToVariant("cancelled")).toBe("inactive");
    expect(incomeStatusToVariant(undefined)).toBe("neutral");
  });

  it("expenseStatusToVariant maps correctly", () => {
    expect(expenseStatusToVariant("paid")).toBe("paid");
    expect(expenseStatusToVariant("pending")).toBe("pending");
    expect(expenseStatusToVariant("cancelled")).toBe("inactive");
  });

  it("transactionStatusToVariant maps correctly", () => {
    expect(transactionStatusToVariant("completed")).toBe("paid");
    expect(transactionStatusToVariant("pending")).toBe("pending");
    expect(transactionStatusToVariant("failed")).toBe("destructive");
    expect(transactionStatusToVariant("cancelled")).toBe("inactive");
  });

  it("transactionTypeVariant maps correctly", () => {
    expect(transactionTypeVariant("income")).toBe("success");
    expect(transactionTypeVariant("expense")).toBe("destructive");
    expect(transactionTypeVariant("fee-payment")).toBe("paid");
    expect(transactionTypeVariant("salary")).toBe("warning");
    expect(transactionTypeVariant("refund")).toBe("info");
  });

  it("paymentMethodLabel maps known methods", () => {
    expect(paymentMethodLabel("cash")).toBe("Cash");
    expect(paymentMethodLabel("bank-transfer")).toBe("Bank Transfer");
    expect(paymentMethodLabel("online")).toBe("Online");
    expect(paymentMethodLabel("cheque")).toBe("Cheque");
    expect(paymentMethodLabel(undefined)).toBe("—");
  });
});

// ── Row Mappers ───────────────────────────────────────────────────────────

describe("Income Head Row Mapper", () => {
  it("counts income records per head", () => {
    const rows = mapIncomeHeadsToRows(mockIncomeHeads, mockIncomeRecords);
    expect(rows).toHaveLength(2);
    const feeRow = rows.find((r) => r.id === "ih-001");
    expect(feeRow?.incomeRecordsCount).toBe(2);
    const donRow = rows.find((r) => r.id === "ih-002");
    expect(donRow?.incomeRecordsCount).toBe(0);
  });

  it("correctly maps head status", () => {
    const rows = mapIncomeHeadsToRows(mockIncomeHeads, mockIncomeRecords);
    const activeRow = rows.find((r) => r.id === "ih-001");
    expect(activeRow?.statusVariant).toBe("active");
    const inactiveRow = rows.find((r) => r.id === "ih-002");
    expect(inactiveRow?.statusVariant).toBe("inactive");
  });
});

describe("Income Record Row Mapper", () => {
  it("resolves head names", () => {
    const rows = mapIncomeRecordsToRows(mockIncomeRecords, mockIncomeHeads);
    expect(rows[0].incomeHeadName).toBe("Fee Revenue");
  });

  it("falls back gracefully for unknown head", () => {
    const orphanRecord = { ...mockIncomeRecords[0], incomeHeadId: "unknown-id" };
    const rows = mapIncomeRecordsToRows([orphanRecord], mockIncomeHeads);
    expect(rows[0].incomeHeadName).toBe("—");
  });

  it("maps payment method label", () => {
    const rows = mapIncomeRecordsToRows(mockIncomeRecords, mockIncomeHeads);
    expect(rows[0].paymentMethodLabel).toBe("Bank Transfer");
  });
});

describe("Expense Head Row Mapper", () => {
  it("counts expense records per head", () => {
    const rows = mapExpenseHeadsToRows(mockExpenseHeads, mockExpenseRecords);
    expect(rows[0].expenseRecordsCount).toBe(1);
  });
});

describe("Expense Record Row Mapper", () => {
  it("resolves expense head names", () => {
    const rows = mapExpenseRecordsToRows(mockExpenseRecords, mockExpenseHeads);
    expect(rows[0].expenseHeadName).toBe("Staff Salaries");
  });

  it("falls back gracefully for unknown head", () => {
    const orphanRecord = { ...mockExpenseRecords[0], expenseHeadId: "unknown-id" };
    const rows = mapExpenseRecordsToRows([orphanRecord], mockExpenseHeads);
    expect(rows[0].expenseHeadName).toBe("—");
  });
});

describe("Transaction Row Mapper", () => {
  it("maps type label and variant", () => {
    const rows = mapTransactionsToRows(mockTransactions);
    expect(rows[0].typeLabel).toBe("Income");
    expect(rows[0].typeVariant).toBe("success");
    expect(rows[1].typeLabel).toBe("Expense");
    expect(rows[1].typeVariant).toBe("destructive");
  });

  it("maps status variant", () => {
    const rows = mapTransactionsToRows(mockTransactions);
    expect(rows[0].statusVariant).toBe("paid"); // completed
    expect(rows[1].statusVariant).toBe("pending");
  });

  it("handles empty transaction list", () => {
    const rows = mapTransactionsToRows([]);
    expect(rows).toHaveLength(0);
  });
});

// ── Finance Calculations ──────────────────────────────────────────────────

describe("computeFinanceSummary", () => {
  it("calculates total income, expenses, and net balance", () => {
    const summary = computeFinanceSummary(mockIncomeRecords, mockExpenseRecords);
    expect(summary.totalIncome).toBe(80000); // 50000 + 30000
    expect(summary.totalExpenses).toBe(100000);
    expect(summary.netBalance).toBe(-20000);
  });

  it("handles empty arrays", () => {
    const summary = computeFinanceSummary([], []);
    expect(summary.totalIncome).toBe(0);
    expect(summary.totalExpenses).toBe(0);
    expect(summary.netBalance).toBe(0);
  });
});

describe("computeHeadSummary", () => {
  it("counts total and active heads", () => {
    const summary = computeHeadSummary(mockIncomeHeads, mockIncomeRecords);
    expect(summary.totalHeads).toBe(2);
    expect(summary.activeHeads).toBe(1);
    expect(summary.recordsCount).toBe(2);
  });
});

describe("computeTransactionSummary", () => {
  it("counts total, income, and expense transactions", () => {
    const summary = computeTransactionSummary(mockTransactions);
    expect(summary.totalTransactions).toBe(2);
    expect(summary.incomeTransactions).toBe(1);
    expect(summary.expenseTransactions).toBe(1);
  });

  it("handles empty array", () => {
    const summary = computeTransactionSummary([]);
    expect(summary.totalTransactions).toBe(0);
  });
});
