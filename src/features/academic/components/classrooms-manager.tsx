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
import { useClassrooms } from "@/hooks/queries/use-academic";
import { mapClassroomsToRows, type ClassroomTableRow } from "../utils/academic-mappers";
import { ClassroomFormDialog } from "./classroom-form-dialog";
import type { Classroom } from "@/types/academic";
import type { ClassroomFormValues } from "@/lib/validations/academic";
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
      { label: "Classroom", value: "classroom" },
      { label: "Lab", value: "lab" },
      { label: "Auditorium", value: "auditorium" },
      { label: "Library", value: "library" },
      { label: "Other", value: "other" },
    ],
  },
];

// ─── Columns ──────────────────────────────────────────────────────────────────

function buildColumns(
  onEdit: (row: ClassroomTableRow) => void,
  onDelete: (id: string) => void
): ColumnDef<ClassroomTableRow>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Room" />,
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
      accessorKey: "building",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Building" />,
      cell: ({ row }) => row.original.building ?? "—",
    },
    {
      accessorKey: "capacity",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Capacity" />,
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

export function ClassroomsManager() {
  const classroomsQuery = useClassrooms();

  const [formOpen, setFormOpen] = React.useState(false);
  const [editingRoom, setEditingRoom] = React.useState<Classroom | undefined>();
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const classrooms = classroomsQuery.data?.data ?? [];

  const rows = React.useMemo(() => mapClassroomsToRows(classrooms), [classrooms]);

  const handleAdd = () => {
    setEditingRoom(undefined);
    setFormOpen(true);
  };

  const handleEdit = (row: ClassroomTableRow) => {
    const found = classrooms.find((r) => r.id === row.id);
    setEditingRoom(found);
    setFormOpen(true);
  };

  const handleSave = (_values: ClassroomFormValues, isEdit: boolean) => {
    toast.success(isEdit ? "Classroom updated." : "Classroom created.");
    setFormOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      toast.success("Classroom deleted.");
      setDeleteId(null);
    }
  };

  const columns = React.useMemo(
    () => buildColumns(handleEdit, (id) => setDeleteId(id)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (classroomsQuery.isLoading) {
    return (
      <div data-testid="classrooms-manager">
        <TableSkeleton columns={7} rows={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="classrooms-manager">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Classrooms</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage rooms, labs, and other learning spaces.
          </p>
        </div>
        <Button onClick={handleAdd} size="sm" className="gap-1.5" data-testid="add-classroom-btn">
          <Plus className="size-4" aria-hidden />
          Add Classroom
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={rows}
        filterConfigs={filters}
        defaultPageSize={10}
        emptyTitle="No classrooms"
        emptyDescription="Add your first classroom using the button above."
      />

      <ClassroomFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        classroom={editingRoom}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => { if (!v) setDeleteId(null); }}
        title="Delete Classroom"
        description="Delete this classroom? Sections assigned here will lose their room assignment."
        onConfirm={handleDelete}
      />
    </div>
  );
}
