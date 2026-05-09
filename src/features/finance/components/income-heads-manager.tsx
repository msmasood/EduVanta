"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { DataTable, TableSkeleton, ConfirmDialog } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { useIncomeHeads, useIncomeRecords } from "@/hooks/queries/use-finance";
import {
  mapIncomeHeadsToRows,
  type IncomeHeadRow,
} from "../utils/finance-mappers";
import { computeHeadSummary } from "../utils/finance-calculations";
import { IncomeHeadFormDialog } from "./income-head-form-dialog";
import { buildIncomeHeadColumns } from "./income-head-columns";
import { HeadSummaryCards } from "./finance-summary-cards";
import type { IncomeHead } from "@/types/finance";
import type { IncomeHeadFormValues } from "@/lib/validations/finance";

export function IncomeHeadsManager() {
  const incomeHeadsQuery = useIncomeHeads();
  const incomeRecordsQuery = useIncomeRecords();

  const [formOpen, setFormOpen] = React.useState(false);
  const [editingHead, setEditingHead] = React.useState<IncomeHead | undefined>();
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const incomeHeads = incomeHeadsQuery.data?.data ?? [];
  const incomeRecords = incomeRecordsQuery.data?.data ?? [];

  const rows = React.useMemo(
    () => mapIncomeHeadsToRows(incomeHeads, incomeRecords),
    [incomeHeads, incomeRecords]
  );

  const summary = React.useMemo(
    () => computeHeadSummary(incomeHeads, incomeRecords),
    [incomeHeads, incomeRecords]
  );

  const handleAdd = () => {
    setEditingHead(undefined);
    setFormOpen(true);
  };

  const handleEdit = (row: IncomeHeadRow) => {
    const found = incomeHeads.find((h) => h.id === row.id);
    setEditingHead(found);
    setFormOpen(true);
  };

  const handleSave = (_values: IncomeHeadFormValues, isEdit: boolean) => {
    toast.success(isEdit ? "Income head updated. (Mock)" : "Income head created. (Mock)");
    setFormOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      toast.success("Income head deleted. (Mock)");
      setDeleteId(null);
    }
  };

  const columns = React.useMemo(
    () => buildIncomeHeadColumns(handleEdit, (id) => setDeleteId(id)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (incomeHeadsQuery.isLoading) {
    return (
      <div data-testid="income-heads-manager">
        <TableSkeleton columns={5} rows={4} />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="income-heads-manager">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Income Heads</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage categories for income records.
          </p>
        </div>
        <Button
          onClick={handleAdd}
          size="sm"
          className="gap-1.5"
          data-testid="add-income-head-btn"
        >
          <Plus className="size-4" aria-hidden />
          Add Income Head
        </Button>
      </div>

      <HeadSummaryCards
        totalHeads={summary.totalHeads}
        activeHeads={summary.activeHeads}
        recordsCount={summary.recordsCount}
        headLabel="Income Heads"
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

      <IncomeHeadFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        head={editingHead}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
        title="Delete Income Head"
        description="Are you sure you want to delete this income head? This action cannot be undone."
        onConfirm={handleDelete}
      />
    </div>
  );
}
