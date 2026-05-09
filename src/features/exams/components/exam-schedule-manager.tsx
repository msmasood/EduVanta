"use client";

import * as React from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { type ColumnDef } from "@tanstack/react-table";

import {
  DataTable,
  TableSkeleton,
  DataTableColumnHeader,
  ConfirmDialog,
} from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { useAllExamSchedules, useExams } from "@/hooks/queries/use-exams";
import { useClasses, useSubjects } from "@/hooks/queries/use-academic";
import {
  mapSchedulesToRows,
  type ExamScheduleTableRow,
} from "../utils/exam-mappers";
import { ExamScheduleFormDialog } from "./exam-schedule-form-dialog";
import type { ExamScheduleFormValues } from "@/lib/validations/exams";
import type { FilterConfig } from "@/components/data-table/data-table";

// ─── Filters ──────────────────────────────────────────────────────────────────

const filters: FilterConfig[] = [];

// ─── Columns ──────────────────────────────────────────────────────────────────

function buildColumns(
  onEdit: (row: ExamScheduleTableRow) => void,
  onDelete: (id: string) => void
): ColumnDef<ExamScheduleTableRow>[] {
  return [
    {
      accessorKey: "examName",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Exam" />,
      cell: ({ row }) => <span className="font-medium">{row.original.examName}</span>,
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
      accessorKey: "date",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
    },
    {
      accessorKey: "startTime",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Start" />,
    },
    {
      accessorKey: "endTime",
      header: ({ column }) => <DataTableColumnHeader column={column} title="End" />,
    },
    {
      accessorKey: "maxMarks",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Max Marks" />,
    },
    {
      accessorKey: "passingMarks",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Pass Marks" />,
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

export function ExamScheduleManager() {
  const schedulesQuery = useAllExamSchedules();
  const examsQuery = useExams();
  const classesQuery = useClasses();
  const subjectsQuery = useSubjects();

  const [formOpen, setFormOpen] = React.useState(false);
  const [editingSchedule, setEditingSchedule] = React.useState<
    (ExamScheduleFormValues & { id?: string }) | undefined
  >();
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const schedules = schedulesQuery.data?.data ?? [];
  const exams = examsQuery.data?.data ?? [];
  const classes = classesQuery.data?.data ?? [];
  const subjects = subjectsQuery.data?.data ?? [];

  const rows = React.useMemo(
    () => mapSchedulesToRows(schedules, exams, subjects, classes),
    [schedules, exams, subjects, classes]
  );

  const handleAdd = () => {
    setEditingSchedule(undefined);
    setFormOpen(true);
  };

  const handleEdit = (row: ExamScheduleTableRow) => {
    const found = schedules.find((s) => s.id === row.id);
    if (found) {
      setEditingSchedule({
        id: found.id,
        examId: found.examId,
        subjectId: found.subjectId,
        classId: found.classId,
        date: found.date,
        startTime: found.startTime,
        endTime: found.endTime,
        classroomId: found.classroomId,
        maxMarks: found.maxMarks,
        passingMarks: found.passingMarks,
      });
    }
    setFormOpen(true);
  };

  const handleSave = (_values: ExamScheduleFormValues, isEdit: boolean) => {
    toast.success(isEdit ? "Schedule updated." : "Schedule created.");
    setFormOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      toast.success("Schedule deleted.");
      setDeleteId(null);
    }
  };

  const columns = React.useMemo(
    () => buildColumns(handleEdit, (id) => setDeleteId(id)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (schedulesQuery.isLoading) {
    return (
      <div data-testid="exam-schedule-manager">
        <TableSkeleton columns={9} rows={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="exam-schedule-manager">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Exam Schedule</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View and manage exam timetable by subject and class.
          </p>
        </div>
        <Button onClick={handleAdd} size="sm" className="gap-1.5" data-testid="add-schedule-btn">
          <Plus className="size-4" aria-hidden />
          Add Schedule
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={rows}
        filterConfigs={filters}
        defaultPageSize={10}
        emptyTitle="No schedules"
        emptyDescription="Add your first exam schedule using the button above."
      />

      <ExamScheduleFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        schedule={editingSchedule}
        exams={exams}
        subjects={subjects}
        classes={classes}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => { if (!v) setDeleteId(null); }}
        title="Delete Schedule"
        description="Are you sure you want to delete this schedule?"
        onConfirm={handleDelete}
      />
    </div>
  );
}
