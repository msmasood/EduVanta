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
import { useSubjects } from "@/hooks/queries/use-academic";
import { mapSubjectsToRows, type SubjectTableRow } from "../utils/academic-mappers";
import { SubjectFormDialog } from "./subject-form-dialog";
import type { Subject } from "@/types/academic";
import type { SubjectFormValues } from "@/lib/validations/academic";
import { type FilterConfig } from "@/components/data-table/data-table";

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
  {
    columnId: "type",
    title: "Type",
    options: [
      { label: "Theory", value: "theory" },
      { label: "Practical", value: "practical" },
      { label: "Elective", value: "elective" },
    ],
  },
];

// ─── Columns ──────────────────────────────────────────────────────────────────

function buildColumns(
  onEdit: (row: SubjectTableRow) => void,
  onDelete: (id: string) => void
): ColumnDef<SubjectTableRow>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Subject" />,
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      accessorKey: "code",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Code" />,
    },
    {
      accessorKey: "type",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
      cell: ({ row }) => row.original.typeLabel,
      filterFn: (row, columnId, filterValues: string[]) => {
        if (!filterValues.length) return true;
        return filterValues.includes(row.getValue(columnId));
      },
    },
    {
      accessorKey: "classCount",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Classes" />,
    },
    {
      accessorKey: "creditHours",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Credit Hrs" />,
      cell: ({ row }) => row.original.creditHours ?? "—",
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

export function SubjectsManager() {
  const subjectsQuery = useSubjects();

  const [formOpen, setFormOpen] = React.useState(false);
  const [editingSubject, setEditingSubject] = React.useState<Subject | undefined>();
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const subjects = subjectsQuery.data?.data ?? [];

  const rows = React.useMemo(() => mapSubjectsToRows(subjects), [subjects]);

  const handleAdd = () => {
    setEditingSubject(undefined);
    setFormOpen(true);
  };

  const handleEdit = (row: SubjectTableRow) => {
    const found = subjects.find((s) => s.id === row.id);
    setEditingSubject(found);
    setFormOpen(true);
  };

  const handleSave = (_values: SubjectFormValues, isEdit: boolean) => {
    toast.success(isEdit ? "Subject updated." : "Subject created.");
    setFormOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      toast.success("Subject deleted.");
      setDeleteId(null);
    }
  };

  const columns = React.useMemo(
    () => buildColumns(handleEdit, (id) => setDeleteId(id)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (subjectsQuery.isLoading) {
    return (
      <div data-testid="subjects-manager">
        <TableSkeleton columns={7} rows={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="subjects-manager">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Subjects</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage subjects offered across classes.
          </p>
        </div>
        <Button onClick={handleAdd} size="sm" className="gap-1.5" data-testid="add-subject-btn">
          <Plus className="size-4" aria-hidden />
          Add Subject
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={rows}
        filterConfigs={filters}
        defaultPageSize={10}
        emptyTitle="No subjects"
        emptyDescription="Add your first subject using the button above."
      />

      <SubjectFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        subject={editingSubject}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => { if (!v) setDeleteId(null); }}
        title="Delete Subject"
        description="Delete this subject? It will be removed from all associated classes."
        onConfirm={handleDelete}
      />
    </div>
  );
}
