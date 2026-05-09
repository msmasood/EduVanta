"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import {
  DataTable,
  TableSkeleton,
  ConfirmDialog,
} from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { useFeeDiscounts, useFeeTypes } from "@/hooks/queries/use-fees";
import { mapFeeDiscountsToRows, type FeeDiscountRow } from "../utils/fee-mappers";
import { FeeDiscountFormDialog } from "./fee-discount-form-dialog";
import { buildFeeDiscountColumns } from "./fee-discount-columns";
import type { FeeDiscount } from "@/types/fees";
import type { FeeDiscountFormValues } from "@/lib/validations/fees";

/**
 * FeeDiscountsManager — list, add, edit, and delete fee discounts.
 * CRUD is mock-only (Sonner toasts).
 */
export function FeeDiscountsManager() {
  const feeDiscountsQuery = useFeeDiscounts();
  const feeTypesQuery = useFeeTypes();

  const [formOpen, setFormOpen] = React.useState(false);
  const [editingDiscount, setEditingDiscount] = React.useState<FeeDiscount | undefined>();
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const feeDiscounts = feeDiscountsQuery.data?.data ?? [];
  const feeTypes = feeTypesQuery.data?.data ?? [];

  const rows = React.useMemo(
    () => mapFeeDiscountsToRows(feeDiscounts, feeTypes),
    [feeDiscounts, feeTypes]
  );

  // Summary stats
  const percentageCount = feeDiscounts.filter((d) => d.discountType === "percentage").length;
  const fixedCount = feeDiscounts.filter((d) => d.discountType === "fixed").length;

  const handleAdd = () => {
    setEditingDiscount(undefined);
    setFormOpen(true);
  };

  const handleEdit = (row: FeeDiscountRow) => {
    const found = feeDiscounts.find((d) => d.id === row.id);
    setEditingDiscount(found);
    setFormOpen(true);
  };

  const handleSave = (_values: FeeDiscountFormValues, isEdit: boolean) => {
    toast.success(isEdit ? "Discount updated. (Mock)" : "Discount created. (Mock)");
    setFormOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      toast.success("Discount deleted. (Mock)");
      setDeleteId(null);
    }
  };

  const columns = React.useMemo(
    () => buildFeeDiscountColumns(handleEdit, (id) => setDeleteId(id)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (feeDiscountsQuery.isLoading) {
    return (
      <div data-testid="fee-discounts-manager">
        <TableSkeleton columns={5} rows={4} />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="fee-discounts-manager">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Fee Discounts</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure fee discounts — {percentageCount} percentage, {fixedCount} fixed.
          </p>
        </div>
        <Button
          onClick={handleAdd}
          size="sm"
          className="gap-1.5"
          data-testid="add-fee-discount-btn"
        >
          <Plus className="size-4" aria-hidden />
          Add Fee Discount
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={rows}
        filterConfigs={[]}
        defaultPageSize={10}
        emptyTitle="No fee discounts"
        emptyDescription="Add your first fee discount using the button above."
      />

      <FeeDiscountFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        discount={editingDiscount}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => { if (!v) setDeleteId(null); }}
        title="Delete Discount"
        description="Are you sure you want to delete this discount? This action cannot be undone."
        onConfirm={handleDelete}
      />
    </div>
  );
}
