"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TextField, SelectField, TextareaField, FormActions } from "@/components/forms";
import { examResultFormSchema, type ExamResultFormValues } from "@/lib/validations/exams";
import { RESULT_STATUS_OPTIONS, GRADE_OPTIONS } from "../utils/exam-form-options";
import type { ExamSchedule } from "@/types/exams";
import type { Student } from "@/types/student";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  result?: ExamResultFormValues & { id?: string };
  schedules: ExamSchedule[];
  students: Student[];
  onSave: (values: ExamResultFormValues, isEdit: boolean) => void;
}

export function ExamResultFormDialog({
  open,
  onOpenChange,
  result,
  schedules,
  students,
  onSave,
}: Props) {
  const [isLoading, setIsLoading] = React.useState(false);

  const scheduleOptions = schedules.map((s) => ({
    label: `${s.examId} — ${s.date}`,
    value: s.id,
  }));
  const studentOptions = students.map((s) => ({
    label: `${s.firstName} ${s.lastName}`,
    value: s.id,
  }));

  const { control, handleSubmit, reset } = useForm<ExamResultFormValues>({
    resolver: zodResolver(examResultFormSchema),
    defaultValues: {
      examScheduleId: "",
      studentId: "",
      marksObtained: undefined,
      maxMarks: undefined,
      grade: "",
      status: "pending",
      remarks: "",
    },
  });

  React.useEffect(() => {
    if (result) {
      reset({
        examScheduleId: result.examScheduleId,
        studentId: result.studentId,
        marksObtained: result.marksObtained,
        maxMarks: result.maxMarks,
        grade: result.grade,
        status: result.status,
        remarks: result.remarks ?? "",
      });
    } else {
      reset({
        examScheduleId: "",
        studentId: "",
        marksObtained: undefined,
        maxMarks: undefined,
        grade: "",
        status: "pending",
        remarks: "",
      });
    }
  }, [result, reset, open]);

  const onSubmit = async (values: ExamResultFormValues) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setIsLoading(false);
    onOpenChange(false);
    onSave(values, !!result);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{result ? "Edit Result" : "Add Result"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 pt-2">
          <SelectField
            control={control}
            name="examScheduleId"
            label="Exam Schedule"
            options={scheduleOptions}
            required
          />
          <SelectField
            control={control}
            name="studentId"
            label="Student"
            options={studentOptions}
            required
          />
          <TextField
            control={control}
            name="marksObtained"
            label="Marks Obtained"
            type="number"
            required
          />
          <TextField
            control={control}
            name="maxMarks"
            label="Max Marks"
            type="number"
            required
          />
          <SelectField
            control={control}
            name="grade"
            label="Grade"
            options={GRADE_OPTIONS}
            required
          />
          <SelectField
            control={control}
            name="status"
            label="Status"
            options={RESULT_STATUS_OPTIONS}
            required
          />
          <TextareaField control={control} name="remarks" label="Remarks" />
          <FormActions
            isLoading={isLoading}
            showCancel
            onCancel={() => onOpenChange(false)}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
