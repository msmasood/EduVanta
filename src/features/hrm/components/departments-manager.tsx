"use client";

import * as React from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { type ColumnDef } from "@tanstack/react-table";

import { DataTable, TableSkeleton, DataTableColumnHeader, ConfirmDialog } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { useDepartments, useEmployees } from "@/hooks/queries/use-employees";
import { mapDepartmentsToRows } from "../utils/hrm-mappers";
import { DepartmentFormDialog } from "./department-form-dialog";
import type { DepartmentTableRow } from "../utils/hrm-mappers";
import type { Department } from "@/types/employee";

// ─── Columns ──────────────────────────────────────────────────────────────────

function buildColumns(
  employeeMap: Map<string, string>,
  onEdit: (row: DepartmentTableRow) => void,
  onDelete: (id: string) => void
): ColumnDef<DepartmentTableRow>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Department" />,
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      accessorKey: "headId",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Head" />,
      cell: ({ row }) =>
        row.original.headId ? (employeeMap.get(row.original.headId) ?? "—") : "—",
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

export function DepartmentsManager() {
  const departmentsQuery = useDepartments();
  const employeesQuery = useEmployees();

  const [formOpen, setFormOpen] = React.useState(false);
  const [editingDept, setEditingDept] = React.useState<Department | undefined>();
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const departments = departmentsQuery.data?.data ?? [];
  const employees = employeesQuery.data?.data ?? [];

  const rows = React.useMemo(
    () => mapDepartmentsToRows(departments, employees),
    [departments, employees]
  );

  const employeeMap = React.useMemo(
    () => new Map(employees.map((e) => [e.id, `${e.firstName} ${e.lastName}`])),
    [employees]
  );

  const handleEdit = (row: DepartmentTableRow) => {
    const dept = departments.find((d) => d.id === row.id);
    setEditingDept(dept);
    setFormOpen(true);
  };

  const handleAdd = () => {
    setEditingDept(undefined);
    setFormOpen(true);
  };

  const handleSave = (isEdit: boolean) => {
    toast.success(isEdit ? "Department updated." : "Department created.");
  };

  const handleDelete = () => {
    if (deleteId) {
      toast.success("Department deleted.");
      setDeleteId(null);
    }
  };

  const columns = React.useMemo(
    () => buildColumns(employeeMap, handleEdit, (id) => setDeleteId(id)),
    [employeeMap]
  );

  if (departmentsQuery.isLoading) {
    return (
      <div data-testid="departments-manager">
        <TableSkeleton columns={4} rows={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="departments-manager">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Departments</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage school departments and their heads.
          </p>
        </div>
        <Button onClick={handleAdd} size="sm" className="gap-1.5">
          <Plus className="size-4" aria-hidden />
          Add Department
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={rows}
        defaultPageSize={10}
        emptyTitle="No departments"
        emptyDescription="Add your first department using the button above."
      />

      <DepartmentFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        department={editingDept}
        employees={employees}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => { if (!v) setDeleteId(null); }}
        title="Delete Department"
        description="Delete this department? Employees will lose their department assignment."
        onConfirm={handleDelete}
      />
    </div>
  );
}
