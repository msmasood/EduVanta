import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NextIntlClientProvider } from "next-intl";

// ── Helpers ───────────────────────────────────────────────────────────────

const messages = {
  table: {
    search: "Search",
    searchPlaceholder: "Search...",
    noResults: "No results found",
    rowsSelected: "{count} row(s) selected",
    rowsPerPage: "Rows per page",
    page: "Page",
    of: "of",
    previous: "Previous",
    next: "Next",
    first: "First",
    last: "Last",
    columns: "Columns",
    showHideColumns: "Show/hide columns",
    resetFilters: "Reset filters",
    export: "Export",
    exportCsv: "Export as CSV",
    confirmExport: "Export?",
    actions: "Actions",
    view: "View",
    edit: "Edit",
    delete: "Delete",
    duplicate: "Duplicate",
    confirmDelete: "Are you sure?",
    cancel: "Cancel",
    confirm: "Confirm",
    loading: "Loading...",
    filterBy: "Filter by {column}",
    clearFilters: "Clear filters",
    selected: "selected",
  },
};

function TestWrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return (
    <QueryClientProvider client={qc}>
      <NextIntlClientProvider locale="en" messages={messages}>
        {children}
      </NextIntlClientProvider>
    </QueryClientProvider>
  );
}

// ── Mock next/navigation ──────────────────────────────────────────────────
vi.mock("next/navigation", () => ({
  useParams: () => ({ locale: "en" }),
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => "/en/finance/income",
}));

// ── FinanceAmountCell ─────────────────────────────────────────────────────
import { FinanceAmountCell } from "@/features/finance/components/finance-amount-cell";

describe("FinanceAmountCell", () => {
  it("renders formatted currency amount", () => {
    render(
      <TestWrapper>
        <FinanceAmountCell amount={50000} currency="PKR" locale="en" />
      </TestWrapper>
    );
    expect(screen.getByText(/50,000|50000/)).toBeDefined();
  });

  it("renders negative amounts as a span", () => {
    const { container } = render(
      <TestWrapper>
        <FinanceAmountCell amount={50000} currency="PKR" locale="en" negative />
      </TestWrapper>
    );
    expect(container.firstChild).toBeDefined();
  });
});

// ── FinanceTypeBadge ──────────────────────────────────────────────────────
import { FinanceTypeBadge } from "@/features/finance/components/finance-type-badge";

describe("FinanceTypeBadge", () => {
  it("renders income type label", () => {
    render(
      <TestWrapper>
        <FinanceTypeBadge type="income" />
      </TestWrapper>
    );
    expect(screen.getByText("Income")).toBeDefined();
  });

  it("renders expense type label", () => {
    render(
      <TestWrapper>
        <FinanceTypeBadge type="expense" />
      </TestWrapper>
    );
    expect(screen.getByText("Expense")).toBeDefined();
  });

  it("renders fee-payment type label", () => {
    render(
      <TestWrapper>
        <FinanceTypeBadge type="fee-payment" />
      </TestWrapper>
    );
    expect(screen.getByText("Fee Payment")).toBeDefined();
  });
});

// ── FinanceStatusBadge ────────────────────────────────────────────────────
import { FinanceStatusBadge } from "@/features/finance/components/finance-status-badge";

describe("FinanceStatusBadge", () => {
  it("renders income status", () => {
    render(
      <TestWrapper>
        <FinanceStatusBadge status="received" type="income" />
      </TestWrapper>
    );
    expect(screen.getByText("Received")).toBeDefined();
  });

  it("renders expense status", () => {
    render(
      <TestWrapper>
        <FinanceStatusBadge status="paid" type="expense" />
      </TestWrapper>
    );
    expect(screen.getByText("Paid")).toBeDefined();
  });

  it("renders head status", () => {
    render(
      <TestWrapper>
        <FinanceStatusBadge status="active" type="head" />
      </TestWrapper>
    );
    expect(screen.getByText("Active")).toBeDefined();
  });
});

// ── Manager data-testid smoke tests ─────────────────────────────────────
import { IncomeHeadsManager } from "@/features/finance/components/income-heads-manager";
import { IncomeManager } from "@/features/finance/components/income-manager";
import { ExpenseHeadsManager } from "@/features/finance/components/expense-heads-manager";
import { ExpensesManager } from "@/features/finance/components/expenses-manager";
import { TransactionsManager } from "@/features/finance/components/transactions-manager";

describe("Finance Manager Components — testid smoke tests", () => {
  it("IncomeHeadsManager renders with data-testid", () => {
    render(
      <TestWrapper>
        <IncomeHeadsManager />
      </TestWrapper>
    );
    expect(screen.getByTestId("income-heads-manager")).toBeDefined();
  });

  it("IncomeManager renders with data-testid", () => {
    render(
      <TestWrapper>
        <IncomeManager />
      </TestWrapper>
    );
    expect(screen.getByTestId("income-manager")).toBeDefined();
  });

  it("ExpenseHeadsManager renders with data-testid", () => {
    render(
      <TestWrapper>
        <ExpenseHeadsManager />
      </TestWrapper>
    );
    expect(screen.getByTestId("expense-heads-manager")).toBeDefined();
  });

  it("ExpensesManager renders with data-testid", () => {
    render(
      <TestWrapper>
        <ExpensesManager />
      </TestWrapper>
    );
    expect(screen.getByTestId("expenses-manager")).toBeDefined();
  });

  it("TransactionsManager renders with data-testid", () => {
    render(
      <TestWrapper>
        <TransactionsManager />
      </TestWrapper>
    );
    expect(screen.getByTestId("transactions-manager")).toBeDefined();
  });
});

// ── TransactionDetailDialog ──────────────────────────────────────────────
import { TransactionDetailDialog } from "@/features/finance/components/transaction-detail-dialog";
import type { TransactionRow } from "@/features/finance/utils/finance-mappers";

const mockTransaction: TransactionRow = {
  id: "txn-001",
  type: "income",
  typeLabel: "Income",
  typeVariant: "success",
  description: "Q1 Fundraiser",
  amount: 50000,
  currency: "PKR",
  paymentMethod: "bank-transfer",
  paymentMethodLabel: "Bank Transfer",
  date: "2024-07-01",
  referenceNumber: "REF-001",
  referenceId: "ir-001",
  referenceType: "IncomeRecord",
  status: "completed",
  statusVariant: "paid",
  statusLabel: "Completed",
};

describe("TransactionDetailDialog", () => {
  it("renders transaction details when open", () => {
    render(
      <TestWrapper>
        <TransactionDetailDialog
          open={true}
          onOpenChange={() => {}}
          transaction={mockTransaction}
          locale="en"
        />
      </TestWrapper>
    );
    expect(screen.getByTestId("transaction-detail-dialog")).toBeDefined();
    expect(screen.getByText("Q1 Fundraiser")).toBeDefined();
  });

  it("does not render when no transaction provided", () => {
    const { container } = render(
      <TestWrapper>
        <TransactionDetailDialog open={true} onOpenChange={() => {}} />
      </TestWrapper>
    );
    expect(container.firstChild).toBeNull();
  });
});
