"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { DataTable, TableSkeleton, ConfirmDialog } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { useIncomeHeads, useIncomeRecords } from "@/hooks/queries/use-finance";
import {
  mapIncomeRecordsToRows,
  type IncomeRecordRow,
} from "../utils/finance-mappers";
import { computeFinanceSummary } from "../utils/finance-calculations";
import { IncomeFormDialog } from "./income-form-dialog";
import { buildIncomeColumns } from "./income-columns";
import { FinanceSummaryCards } from "./finance-summary-cards";
import type { IncomeFormValues } from "@/lib/validations/finance";

export function IncomeManager() {
  const incomeHeadsQuery = useIncomeHeads();
  const incomeRecordsQuery = useIncomeRecords();

  const [formOpen, setFormOpen] = React.useState(false);
  const [editingIncome, setEditingIncome] = React.useState<IncomeRecordRow | undefined>();
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const incomeHeads = incomeHeadsQuery.data?.data ?? [];
  const incomeRecordsRaw = incomeRecordsQuery.data?.data ?? [];

  const rows = React.useMemo(
    () => mapIncomeRecordsToRows(incomeRecordsRaw, incomeHeads),
    [incomeRecordsRaw, incomeHeads]
  );

  const summary = React.useMemo(
    () => computeFinanceSummary(incomeRecordsRaw, []),
    [incomeRecordsRaw]
  );

  const handleAdd = () => {
    setEditingIncome(undefined);
    setFormOpen(true);
  };

  const handleEdit = (row: IncomeRecordRow) => {
    setEditingIncome(row);
    setFormOpen(true);
  };

  const handleSave = (_values: IncomeFormValues, isEdit: boolean) => {
    toast.success(isEdit ? "Income record updated. (Mock)" : "Income record created. (Mock)");
    setFormOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      toast.success("Income record deleted. (Mock)");
      setDeleteId(null);
    }
  };

  const columns = React.useMemo(
    () => buildIncomeColumns(handleEdit, (id) => setDeleteId(id)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (incomeRecordsQuery.isLoading) {
    return (
      <div data-testid="income-manager">
        <TableSkeleton columns={7} rows={4} />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="income-manager">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Income</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track all income records and revenue sources.
          </p>
        </div>
        <Button
          onClick={handleAdd}
          size="sm"
          className="gap-1.5"
          data-testid="add-income-btn"
        >
          <Plus className="size-4" aria-hidden />
          Add Income
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
              { label: "Received", value: "received" },
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

      <IncomeFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        incomeHeads={incomeHeads}
        income={editingIncome}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
        title="Delete Income Record"
        description="Are you sure you want to delete this income record? This action cannot be undone."
        onConfirm={handleDelete}
      />
    </div>
  );
}
