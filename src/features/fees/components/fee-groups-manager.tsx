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
import { useFeeGroups, useFeeTypes } from "@/hooks/queries/use-fees";
import {
  mapFeeGroupsToRows,
  type FeeGroupRow,
} from "../utils/fee-mappers";
import { FeeGroupFormDialog } from "./fee-group-form-dialog";
import { buildFeeGroupColumns } from "./fee-group-columns";
import type { FeeGroup } from "@/types/fees";
import type { FeeGroupFormValues } from "@/lib/validations/fees";

/**
 * FeeGroupsManager — list, add, edit, and delete fee groups.
 * CRUD is mock-only (Sonner toasts).
 */
export function FeeGroupsManager() {
  const feeGroupsQuery = useFeeGroups();
  const feeTypesQuery = useFeeTypes();

  const [formOpen, setFormOpen] = React.useState(false);
  const [editingGroup, setEditingGroup] = React.useState<FeeGroup | undefined>();
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const feeGroups = feeGroupsQuery.data?.data ?? [];
  const feeTypes = feeTypesQuery.data?.data ?? [];

  const rows = React.useMemo(
    () => mapFeeGroupsToRows(feeGroups, feeTypes),
    [feeGroups, feeTypes]
  );

  // Summary stats
  const total = feeGroups.length;

  const handleAdd = () => {
    setEditingGroup(undefined);
    setFormOpen(true);
  };

  const handleEdit = (row: FeeGroupRow) => {
    const found = feeGroups.find((g) => g.id === row.id);
    setEditingGroup(found);
    setFormOpen(true);
  };

  const handleSave = (_values: FeeGroupFormValues, isEdit: boolean) => {
    toast.success(isEdit ? "Fee group updated. (Mock)" : "Fee group created. (Mock)");
    setFormOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      toast.success("Fee group deleted. (Mock)");
      setDeleteId(null);
    }
  };

  const columns = React.useMemo(
    () => buildFeeGroupColumns(handleEdit, (id) => setDeleteId(id)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (feeGroupsQuery.isLoading) {
    return (
      <div data-testid="fee-groups-manager">
        <TableSkeleton columns={4} rows={4} />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="fee-groups-manager">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Fee Groups</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Organise fee types into logical groups. Total groups: {total}
          </p>
        </div>
        <Button
          onClick={handleAdd}
          size="sm"
          className="gap-1.5"
          data-testid="add-fee-group-btn"
        >
          <Plus className="size-4" aria-hidden />
          Add Fee Group
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={rows}
        filterConfigs={[]}
        defaultPageSize={10}
        emptyTitle="No fee groups"
        emptyDescription="Add your first fee group using the button above."
      />

      <FeeGroupFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        group={editingGroup}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => { if (!v) setDeleteId(null); }}
        title="Delete Fee Group"
        description="Are you sure you want to delete this fee group? This action cannot be undone."
        onConfirm={handleDelete}
      />
    </div>
  );
}
