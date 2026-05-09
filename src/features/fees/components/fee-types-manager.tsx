"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useParams } from "next/navigation";

import {
  DataTable,
  TableSkeleton,
  ConfirmDialog,
} from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { useFeeTypes, useFeeGroups } from "@/hooks/queries/use-fees";
import { mapFeeTypesToRows, type FeeTypeRow } from "../utils/fee-mappers";
import { FeeTypeFormDialog } from "./fee-type-form-dialog";
import { buildFeeTypeColumns } from "./fee-type-columns";
import type { FeeType } from "@/types/fees";
import type { FeeTypeFormValues } from "@/lib/validations/fees";

/**
 * FeeTypesManager — list, add, edit, and delete fee types.
 * CRUD is mock-only (Sonner toasts).
 */
export function FeeTypesManager() {
  const params = useParams();
  const locale = typeof params.locale === "string" ? params.locale : "en";

  const feeTypesQuery = useFeeTypes();
  const feeGroupsQuery = useFeeGroups();

  const [formOpen, setFormOpen] = React.useState(false);
  const [editingType, setEditingType] = React.useState<FeeType | undefined>();
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const feeTypes = feeTypesQuery.data?.data ?? [];
  const feeGroups = feeGroupsQuery.data?.data ?? [];

  const rows = React.useMemo(
    () => mapFeeTypesToRows(feeTypes, feeGroups),
    [feeTypes, feeGroups]
  );

  const handleAdd = () => {
    setEditingType(undefined);
    setFormOpen(true);
  };

  const handleEdit = (row: FeeTypeRow) => {
    const found = feeTypes.find((t) => t.id === row.id);
    setEditingType(found);
    setFormOpen(true);
  };

  const handleSave = (_values: FeeTypeFormValues, isEdit: boolean) => {
    toast.success(isEdit ? "Fee type updated. (Mock)" : "Fee type created. (Mock)");
    setFormOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      toast.success("Fee type deleted. (Mock)");
      setDeleteId(null);
    }
  };

  const columns = React.useMemo(
    () => buildFeeTypeColumns(handleEdit, (id) => setDeleteId(id), locale),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale]
  );

  if (feeTypesQuery.isLoading) {
    return (
      <div data-testid="fee-types-manager">
        <TableSkeleton columns={5} rows={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="fee-types-manager">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Fee Types</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Define fee types with amounts, frequencies, and group assignments.
          </p>
        </div>
        <Button
          onClick={handleAdd}
          size="sm"
          className="gap-1.5"
          data-testid="add-fee-type-btn"
        >
          <Plus className="size-4" aria-hidden />
          Add Fee Type
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={rows}
        filterConfigs={[]}
        defaultPageSize={10}
        emptyTitle="No fee types"
        emptyDescription="Add your first fee type using the button above."
      />

      <FeeTypeFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        feeType={editingType}
        feeGroups={feeGroups}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => { if (!v) setDeleteId(null); }}
        title="Delete Fee Type"
        description="Are you sure you want to delete this fee type? This action cannot be undone."
        onConfirm={handleDelete}
      />
    </div>
  );
}
