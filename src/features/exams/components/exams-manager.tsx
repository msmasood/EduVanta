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
import { useExams } from "@/hooks/queries/use-exams";
import { useClasses, useSubjects } from "@/hooks/queries/use-academic";
import {
  mapExamsToRows,
  computeExamSummary,
  type ExamTableRow,
} from "../utils/exam-mappers";
import { ExamSummaryCards } from "./exam-summary-cards";
import { ExamFormDialog } from "./exam-form-dialog";
import type { Exam } from "@/types/exams";
import type { ExamFormValues } from "@/lib/validations/exams";
import type { FilterConfig } from "@/components/data-table/data-table";

// ─── Filters ──────────────────────────────────────────────────────────────────

const filters: FilterConfig[] = [
  {
    columnId: "status",
    title: "Status",
    options: [
      { label: "Upcoming", value: "upcoming" },
      { label: "Ongoing", value: "ongoing" },
      { label: "Completed", value: "completed" },
      { label: "Cancelled", value: "cancelled" },
    ],
  },
];

// ─── Columns ──────────────────────────────────────────────────────────────────

function buildColumns(
  onEdit: (row: ExamTableRow) => void,
  onDelete: (id: string) => void
): ColumnDef<ExamTableRow>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Exam Name" />,
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      accessorKey: "termName",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Term" />,
    },
    {
      accessorKey: "startDate",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Start Date" />,
    },
    {
      accessorKey: "endDate",
      header: ({ column }) => <DataTableColumnHeader column={column} title="End Date" />,
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => (
        <StatusBadge
          status={row.original.statusVariant}
          label={row.original.statusLabel}
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

export function ExamsManager() {
  const examsQuery = useExams();
  useClasses();
  useSubjects();

  const [formOpen, setFormOpen] = React.useState(false);
  const [editingExam, setEditingExam] = React.useState<Exam | undefined>();
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const exams = examsQuery.data?.data ?? [];

  const rows = React.useMemo(() => mapExamsToRows(exams), [exams]);
  const summary = React.useMemo(() => computeExamSummary(exams), [exams]);

  const handleAdd = () => {
    setEditingExam(undefined);
    setFormOpen(true);
  };

  const handleEdit = (row: ExamTableRow) => {
    const found = exams.find((e) => e.id === row.id);
    setEditingExam(found);
    setFormOpen(true);
  };

  const handleSave = (_values: ExamFormValues, isEdit: boolean) => {
    toast.success(isEdit ? "Exam updated." : "Exam created.");
    setFormOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      toast.success("Exam deleted.");
      setDeleteId(null);
    }
  };

  const columns = React.useMemo(
    () => buildColumns(handleEdit, (id) => setDeleteId(id)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (examsQuery.isLoading) {
    return (
      <div data-testid="exams-manager">
        <TableSkeleton columns={6} rows={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="exams-manager">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Examinations</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage all school examinations and their schedules.
          </p>
        </div>
        <Button onClick={handleAdd} size="sm" className="gap-1.5" data-testid="add-exam-btn">
          <Plus className="size-4" aria-hidden />
          Add Exam
        </Button>
      </div>

      <ExamSummaryCards summary={summary} />

      <DataTable
        columns={columns}
        data={rows}
        filterConfigs={filters}
        defaultPageSize={10}
        emptyTitle="No exams"
        emptyDescription="Add your first exam using the button above."
      />

      <ExamFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        exam={editingExam}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => { if (!v) setDeleteId(null); }}
        title="Delete Exam"
        description="Are you sure you want to delete this exam? This action cannot be undone."
        onConfirm={handleDelete}
      />
    </div>
  );
}
