"use client";

import * as React from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { type ColumnDef } from "@tanstack/react-table";

import { DataTable, TableSkeleton, DataTableColumnHeader, ConfirmDialog } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { useDepartments, useDesignations, useEmployees } from "@/hooks/queries/use-employees";
import { mapDesignationsToRows } from "../utils/hrm-mappers";
import { DesignationFormDialog } from "./designation-form-dialog";
import type { DesignationTableRow } from "../utils/hrm-mappers";
import type { Designation } from "@/types/employee";

// ─── Columns ──────────────────────────────────────────────────────────────────

function buildColumns(
  onEdit: (row: DesignationTableRow) => void,
  onDelete: (id: string) => void
): ColumnDef<DesignationTableRow>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Designation" />,
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      accessorKey: "departmentName",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Department" />,
    },
    {
      accessorKey: "employeeCount",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Employees" />,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(row.original)}
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Edit"
          >
            <Pencil className="size-4" aria-hidden />
          </button>
          <button
            onClick={() => onDelete(row.original.id)}
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-destructive"
            aria-label="Delete"
          >
            <Trash2 className="size-4" aria-hidden />
          </button>
        </div>
      ),
    },
  ];
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DesignationsManager() {
  const designationsQuery = useDesignations();
  const departmentsQuery = useDepartments();
  const employeesQuery = useEmployees();

  const [formOpen, setFormOpen] = React.useState(false);
  const [editingDes, setEditingDes] = React.useState<Designation | undefined>();
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const designations = designationsQuery.data?.data ?? [];
  const departments = departmentsQuery.data?.data ?? [];
  const employees = employeesQuery.data?.data ?? [];

  const rows = React.useMemo(
    () => mapDesignationsToRows(designations, departments, employees),
    [designations, departments, employees]
  );

  const handleEdit = (row: DesignationTableRow) => {
    const des = designations.find((d) => d.id === row.id);
    setEditingDes(des);
    setFormOpen(true);
  };

  const handleAdd = () => {
    setEditingDes(undefined);
    setFormOpen(true);
  };

  const handleSave = (isEdit: boolean) => {
    toast.success(isEdit ? "Designation updated." : "Designation created.");
  };

  const handleDelete = () => {
    if (deleteId) {
      toast.success("Designation deleted.");
      setDeleteId(null);
    }
  };

  const columns = React.useMemo(
    () => buildColumns(handleEdit, (id) => setDeleteId(id)),
    []
  );

  if (designationsQuery.isLoading || departmentsQuery.isLoading) {
    return (
      <div data-testid="designations-manager">
        <TableSkeleton columns={4} rows={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="designations-manager">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Designations</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage job designations and roles.
          </p>
        </div>
        <Button onClick={handleAdd} size="sm" className="gap-1.5">
          <Plus className="size-4" aria-hidden />
          Add Designation
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={rows}
        defaultPageSize={10}
        emptyTitle="No designations"
        emptyDescription="Add your first designation using the button above."
      />

      <DesignationFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        designation={editingDes}
        departments={departments}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => { if (!v) setDeleteId(null); }}
        title="Delete Designation"
        description="Delete this designation? Employees will lose their designation assignment."
        onConfirm={handleDelete}
      />
    </div>
  );
}
