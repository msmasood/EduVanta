"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { DataTable, TableSkeleton, ConfirmDialog } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { useExpenseHeads, useExpenseRecords } from "@/hooks/queries/use-finance";
import {
  mapExpenseRecordsToRows,
  type ExpenseRecordRow,
} from "../utils/finance-mappers";
import { computeFinanceSummary } from "../utils/finance-calculations";
import { ExpenseFormDialog } from "./expense-form-dialog";
import { buildExpenseColumns } from "./expense-columns";
import { FinanceSummaryCards } from "./finance-summary-cards";
import type { ExpenseFormValues } from "@/lib/validations/finance";

export function ExpensesManager() {
  const expenseHeadsQuery = useExpenseHeads();
  const expenseRecordsQuery = useExpenseRecords();

  const [formOpen, setFormOpen] = React.useState(false);
  const [editingExpense, setEditingExpense] = React.useState<ExpenseRecordRow | undefined>();
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const expenseHeads = expenseHeadsQuery.data?.data ?? [];
  const expenseRecordsRaw = expenseRecordsQuery.data?.data ?? [];

  const rows = React.useMemo(
    () => mapExpenseRecordsToRows(expenseRecordsRaw, expenseHeads),
    [expenseRecordsRaw, expenseHeads]
  );

  const summary = React.useMemo(
    () => computeFinanceSummary([], expenseRecordsRaw),
    [expenseRecordsRaw]
  );

  const handleAdd = () => {
    setEditingExpense(undefined);
    setFormOpen(true);
  };

  const handleEdit = (row: ExpenseRecordRow) => {
    setEditingExpense(row);
    setFormOpen(true);
  };

  const handleSave = (_values: ExpenseFormValues, isEdit: boolean) => {
    toast.success(isEdit ? "Expense record updated. (Mock)" : "Expense record created. (Mock)");
    setFormOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      toast.success("Expense record deleted. (Mock)");
      setDeleteId(null);
    }
  };

  const columns = React.useMemo(
    () => buildExpenseColumns(handleEdit, (id) => setDeleteId(id)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (expenseRecordsQuery.isLoading) {
    return (
      <div data-testid="expenses-manager">
        <TableSkeleton columns={7} rows={4} />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="expenses-manager">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Expenses</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track all expense records and outgoing payments.
          </p>
        </div>
        <Button
          onClick={handleAdd}
          size="sm"
          className="gap-1.5"
          data-testid="add-expense-btn"
        >
          <Plus className="size-4" aria-hidden />
          Add Expense
        </Button>
      </div>

      <FinanceSummaryCards summary={summary} />

      <DataTable
        columns={columns}
        data={rows}
        filterConfigs={[
          {
            columnId: "status",
            title: "Status",
            options: [
              { label: "Paid", value: "paid" },
              { label: "Pending", value: "pending" },
              { label: "Cancelled", value: "cancelled" },
            ],
          },
          {
            columnId: "paymentMethodLabel",
            title: "Payment Method",
            options: [
              { label: "Cash", value: "Cash" },
              { label: "Bank Transfer", value: "Bank Transfer" },
              { label: "Online", value: "Online" },
              { label: "Cheque", value: "Cheque" },
            ],
          },
        ]}
      />

      <ExpenseFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        expenseHeads={expenseHeads}
        expense={editingExpense}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
        title="Delete Expense Record"
        description="Are you sure you want to delete this expense record? This action cannot be undone."
        onConfirm={handleDelete}
      />
    </div>
  );
}
