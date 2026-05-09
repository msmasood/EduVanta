"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { DataTable, TableSkeleton, ConfirmDialog } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { useExpenseHeads, useExpenseRecords } from "@/hooks/queries/use-finance";
import {
  mapExpenseHeadsToRows,
  type ExpenseHeadRow,
} from "../utils/finance-mappers";
import { computeHeadSummary } from "../utils/finance-calculations";
import { ExpenseHeadFormDialog } from "./expense-head-form-dialog";
import { buildExpenseHeadColumns } from "./expense-head-columns";
import { HeadSummaryCards } from "./finance-summary-cards";
import type { ExpenseHead } from "@/types/finance";
import type { ExpenseHeadFormValues } from "@/lib/validations/finance";

export function ExpenseHeadsManager() {
  const expenseHeadsQuery = useExpenseHeads();
  const expenseRecordsQuery = useExpenseRecords();

  const [formOpen, setFormOpen] = React.useState(false);
  const [editingHead, setEditingHead] = React.useState<ExpenseHead | undefined>();
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const expenseHeads = expenseHeadsQuery.data?.data ?? [];
  const expenseRecords = expenseRecordsQuery.data?.data ?? [];

  const rows = React.useMemo(
    () => mapExpenseHeadsToRows(expenseHeads, expenseRecords),
    [expenseHeads, expenseRecords]
  );

  const summary = React.useMemo(
    () => computeHeadSummary(expenseHeads, expenseRecords),
    [expenseHeads, expenseRecords]
  );

  const handleAdd = () => {
    setEditingHead(undefined);
    setFormOpen(true);
  };

  const handleEdit = (row: ExpenseHeadRow) => {
    const found = expenseHeads.find((h) => h.id === row.id);
    setEditingHead(found);
    setFormOpen(true);
  };

  const handleSave = (_values: ExpenseHeadFormValues, isEdit: boolean) => {
    toast.success(isEdit ? "Expense head updated. (Mock)" : "Expense head created. (Mock)");
    setFormOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      toast.success("Expense head deleted. (Mock)");
      setDeleteId(null);
    }
  };

  const columns = React.useMemo(
    () => buildExpenseHeadColumns(handleEdit, (id) => setDeleteId(id)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (expenseHeadsQuery.isLoading) {
    return (
      <div data-testid="expense-heads-manager">
        <TableSkeleton columns={5} rows={4} />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="expense-heads-manager">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Expense Heads</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage categories for expense records.
          </p>
        </div>
        <Button
          onClick={handleAdd}
          size="sm"
          className="gap-1.5"
          data-testid="add-expense-head-btn"
        >
          <Plus className="size-4" aria-hidden />
          Add Expense Head
        </Button>
      </div>

      <HeadSummaryCards
        totalHeads={summary.totalHeads}
        activeHeads={summary.activeHeads}
        recordsCount={summary.recordsCount}
        headLabel="Expense Heads"
      />

      <DataTable
        columns={columns}
        data={rows}
        filterConfigs={[
          {
            columnId: "status",
            title: "Status",
            options: [
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ],
          },
        ]}
      />

      <ExpenseHeadFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        head={editingHead}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
        title="Delete Expense Head"
        description="Are you sure you want to delete this expense head? This action cannot be undone."
        onConfirm={handleDelete}
      />
    </div>
  );
}
