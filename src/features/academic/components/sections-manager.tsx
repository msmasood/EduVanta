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
import { useClasses, useSections, useClassrooms } from "@/hooks/queries/use-academic";
import { useTeachers } from "@/hooks/queries/use-teachers";
import { mapSectionsToRows, type SectionTableRow } from "../utils/academic-mappers";
import { SectionFormDialog } from "./section-form-dialog";
import type { Section } from "@/types/academic";
import type { SectionFormValues } from "@/lib/validations/academic";
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
];

// ─── Columns ──────────────────────────────────────────────────────────────────

function buildColumns(
  onEdit: (row: SectionTableRow) => void,
  onDelete: (id: string) => void
): ColumnDef<SectionTableRow>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Section" />,
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      accessorKey: "code",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Code" />,
    },
    {
      accessorKey: "className",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Class" />,
    },
    {
      accessorKey: "teacherName",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Teacher" />,
    },
    {
      accessorKey: "classroomName",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Classroom" />,
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

export function SectionsManager() {
  const sectionsQuery = useSections();
  const classesQuery = useClasses();
  const classroomsQuery = useClassrooms();
  const teachersQuery = useTeachers();

  const [formOpen, setFormOpen] = React.useState(false);
  const [editingSection, setEditingSection] = React.useState<Section | undefined>();
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const sections = sectionsQuery.data?.data ?? [];
  const classes = classesQuery.data?.data ?? [];
  const classrooms = classroomsQuery.data?.data ?? [];
  const teachers = teachersQuery.data?.data ?? [];

  const rows = React.useMemo(
    () => mapSectionsToRows(sections, classes, teachers, classrooms),
    [sections, classes, teachers, classrooms]
  );

  const handleAdd = () => {
    setEditingSection(undefined);
    setFormOpen(true);
  };

  const handleEdit = (row: SectionTableRow) => {
    const found = sections.find((s) => s.id === row.id);
    setEditingSection(found);
    setFormOpen(true);
  };

  const handleSave = (_values: SectionFormValues, isEdit: boolean) => {
    toast.success(isEdit ? "Section updated." : "Section created.");
    setFormOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      toast.success("Section deleted.");
      setDeleteId(null);
    }
  };

  const columns = React.useMemo(
    () => buildColumns(handleEdit, (id) => setDeleteId(id)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const isLoading =
    sectionsQuery.isLoading ||
    classesQuery.isLoading ||
    classroomsQuery.isLoading ||
    teachersQuery.isLoading;

  if (isLoading) {
    return (
      <div data-testid="sections-manager">
        <TableSkeleton columns={8} rows={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="sections-manager">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Sections</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage class sections and their assigned teachers and rooms.
          </p>
        </div>
        <Button onClick={handleAdd} size="sm" className="gap-1.5" data-testid="add-section-btn">
          <Plus className="size-4" aria-hidden />
          Add Section
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={rows}
        filterConfigs={filters}
        defaultPageSize={10}
        emptyTitle="No sections"
        emptyDescription="Add your first section using the button above."
      />

      <SectionFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        section={editingSection}
        classes={classes}
        classrooms={classrooms}
        teachers={teachers}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => { if (!v) setDeleteId(null); }}
        title="Delete Section"
        description="Delete this section? Students in this section will be unassigned."
        onConfirm={handleDelete}
      />
    </div>
  );
}
