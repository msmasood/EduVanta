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
import { useAllExamResults } from "@/hooks/queries/use-exams";
import { useAllExamSchedules } from "@/hooks/queries/use-exams";
import { useClasses, useSubjects } from "@/hooks/queries/use-academic";
import { useStudents } from "@/hooks/queries/use-students";
import {
  mapResultsToRows,
  computeResultSummary,
  type ExamResultTableRow,
} from "../utils/exam-mappers";
import { ExamResultSummaryCards } from "./exam-result-summary-cards";
import { GradeBadge } from "./grade-badge";
import { MarksCell } from "./marks-cell";
import { ExamResultFormDialog } from "./exam-result-form-dialog";
import type { ExamResultFormValues } from "@/lib/validations/exams";
import type { FilterConfig } from "@/components/data-table/data-table";

// ─── Filters ──────────────────────────────────────────────────────────────────

const filters: FilterConfig[] = [
  {
    columnId: "status",
    title: "Status",
    options: [
      { label: "Pass", value: "pass" },
      { label: "Fail", value: "fail" },
      { label: "Absent", value: "absent" },
      { label: "Pending", value: "pending" },
    ],
  },
];

// ─── Columns ──────────────────────────────────────────────────────────────────

function buildColumns(
  onEdit: (row: ExamResultTableRow) => void,
  onDelete: (id: string) => void
): ColumnDef<ExamResultTableRow>[] {
  return [
    {
      accessorKey: "studentName",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Student" />,
      cell: ({ row }) => <span className="font-medium">{row.original.studentName}</span>,
    },
    {
      accessorKey: "subjectName",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Subject" />,
    },
    {
      accessorKey: "className",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Class" />,
    },
    {
      accessorKey: "marksObtained",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Marks" />,
      cell: ({ row }) => (
        <MarksCell
          marksObtained={row.original.marksObtained}
          maxMarks={row.original.maxMarks}
          percentage={row.original.percentage}
        />
      ),
    },
    {
      accessorKey: "grade",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Grade" />,
      cell: ({ row }) => <GradeBadge grade={row.original.grade} />,
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Result" />,
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

export function ExamResultsManager() {
  const resultsQuery = useAllExamResults();
  const schedulesQuery = useAllExamSchedules();
  const classesQuery = useClasses();
  const subjectsQuery = useSubjects();
  const studentsQuery = useStudents();

  const [formOpen, setFormOpen] = React.useState(false);
  const [editingResult, setEditingResult] = React.useState<
    (ExamResultFormValues & { id?: string }) | undefined
  >();
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const results = resultsQuery.data?.data ?? [];
  const schedules = schedulesQuery.data?.data ?? [];
  const classes = classesQuery.data?.data ?? [];
  const subjects = subjectsQuery.data?.data ?? [];
  const students = studentsQuery.data?.data ?? [];

  const rows = React.useMemo(
    () => mapResultsToRows(results, schedules, subjects, classes, students),
    [results, schedules, subjects, classes, students]
  );

  const summary = React.useMemo(() => computeResultSummary(results), [results]);

  const handleAdd = () => {
    setEditingResult(undefined);
    setFormOpen(true);
  };

  const handleEdit = (row: ExamResultTableRow) => {
    const found = results.find((r) => r.id === row.id);
    if (found) {
      setEditingResult({
        id: found.id,
        examScheduleId: found.examScheduleId,
        studentId: found.studentId,
        marksObtained: found.marksObtained,
        maxMarks: found.maxMarks,
        grade: found.grade,
        status: found.status,
        remarks: found.remarks,
      });
    }
    setFormOpen(true);
  };

  const handleSave = (_values: ExamResultFormValues, isEdit: boolean) => {
    toast.success(isEdit ? "Result updated." : "Result created.");
    setFormOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      toast.success("Result deleted.");
      setDeleteId(null);
    }
  };

  const columns = React.useMemo(
    () => buildColumns(handleEdit, (id) => setDeleteId(id)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (resultsQuery.isLoading) {
    return (
      <div data-testid="exam-results-manager">
        <TableSkeleton columns={7} rows={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="exam-results-manager">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Exam Results</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View and manage student exam results and grades.
          </p>
        </div>
        <Button onClick={handleAdd} size="sm" className="gap-1.5" data-testid="add-result-btn">
          <Plus className="size-4" aria-hidden />
          Add Result
        </Button>
      </div>

      <ExamResultSummaryCards summary={summary} />

      <DataTable
        columns={columns}
        data={rows}
        filterConfigs={filters}
        defaultPageSize={10}
        emptyTitle="No results"
        emptyDescription="Add exam results using the button above."
      />

      <ExamResultFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        result={editingResult}
        schedules={schedules}
        students={students}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => { if (!v) setDeleteId(null); }}
        title="Delete Result"
        description="Are you sure you want to delete this result?"
        onConfirm={handleDelete}
      />
    </div>
  );
}
