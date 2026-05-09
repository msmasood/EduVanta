"use client";

import * as React from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { type ColumnDef } from "@tanstack/react-table";

import {
  DataTable,
  TableSkeleton,
  DataTableColumnHeader,
  StatusBadge,
  ConfirmDialog,
} from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { useClasses, useSections } from "@/hooks/queries/use-academic";
import { mapClassesToRows, type ClassTableRow } from "../utils/academic-mappers";
import { ClassFormDialog } from "./class-form-dialog";
import type { ClassLevel } from "@/types/academic";
import type { ClassFormValues } from "@/lib/validations/academic";
import type { FilterConfig } from "@/components/data-table/data-table";

// ─── Filters ──────────────────────────────────────────────────────────────────

const filters: FilterConfig[] = [
  {
    columnId: "status",
    title: "Status",
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ],
  },
];

// ─── Columns ──────────────────────────────────────────────────────────────────

function buildColumns(
  onEdit: (row: ClassTableRow) => void,
  onDelete: (id: string) => void
): ColumnDef<ClassTableRow>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Class" />,
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      accessorKey: "code",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Code" />,
    },
    {
      accessorKey: "order",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Order" />,
    },
    {
      accessorKey: "sectionCount",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Sections" />,
    },
    {
      accessorKey: "capacity",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Capacity" />,
      cell: ({ row }) => row.original.capacity ?? "—",
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => (
        <StatusBadge
          status={row.original.statusVariant}
          label={row.original.status === "active" ? "Active" : "Inactive"}
        />
      ),
      filterFn: (row, columnId, filterValues: string[]) => {
        if (!filterValues.length) return true;
        return filterValues.includes(row.getValue(columnId));
      },
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

export function ClassesManager() {
  const classesQuery = useClasses();
  const sectionsQuery = useSections();

  const [formOpen, setFormOpen] = React.useState(false);
  const [editingClass, setEditingClass] = React.useState<ClassLevel | undefined>();
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const classes = classesQuery.data?.data ?? [];
  const sections = sectionsQuery.data?.data ?? [];

  const rows = React.useMemo(
    () => mapClassesToRows(classes, sections),
    [classes, sections]
  );

  const handleAdd = () => {
    setEditingClass(undefined);
    setFormOpen(true);
  };

  const handleEdit = (row: ClassTableRow) => {
    const found = classes.find((c) => c.id === row.id);
    setEditingClass(found);
    setFormOpen(true);
  };

  const handleSave = (_values: ClassFormValues, isEdit: boolean) => {
    toast.success(isEdit ? "Class updated." : "Class created.");
    setFormOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      toast.success("Class deleted.");
      setDeleteId(null);
    }
  };

  const columns = React.useMemo(
    () => buildColumns(handleEdit, (id) => setDeleteId(id)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (classesQuery.isLoading) {
    return (
      <div data-testid="classes-manager">
        <TableSkeleton columns={7} rows={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="classes-manager">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Classes</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage class levels and their sections.
          </p>
        </div>
        <Button onClick={handleAdd} size="sm" className="gap-1.5" data-testid="add-class-btn">
          <Plus className="size-4" aria-hidden />
          Add Class
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={rows}
        filterConfigs={filters}
        defaultPageSize={10}
        emptyTitle="No classes"
        emptyDescription="Add your first class using the button above."
      />

      <ClassFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        classLevel={editingClass}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => { if (!v) setDeleteId(null); }}
        title="Delete Class"
        description="Delete this class? All associated sections will lose their class assignment."
        onConfirm={handleDelete}
      />
    </div>
  );
}
