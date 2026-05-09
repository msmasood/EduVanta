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
import { TextField, SelectField, FormActions } from "@/components/forms";
import { examFormSchema, type ExamFormValues } from "@/lib/validations/exams";
import { EXAM_STATUS_OPTIONS } from "../utils/exam-form-options";
import type { Exam } from "@/types/exams";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  exam?: Exam;
  onSave: (values: ExamFormValues, isEdit: boolean) => void;
}

export function ExamFormDialog({ open, onOpenChange, exam, onSave }: Props) {
  const [isLoading, setIsLoading] = React.useState(false);

  const { control, handleSubmit, reset } = useForm<ExamFormValues>({
    resolver: zodResolver(examFormSchema),
    defaultValues: {
      name: "",
      termName: "",
      startDate: "",
      endDate: "",
      status: "upcoming",
    },
  });

  React.useEffect(() => {
    if (exam) {
      reset({
        name: exam.name,
        termName: exam.termName,
        startDate: exam.startDate,
        endDate: exam.endDate,
        status: exam.status,
      });
    } else {
      reset({ name: "", termName: "", startDate: "", endDate: "", status: "upcoming" });
    }
  }, [exam, reset, open]);

  const onSubmit = async (values: ExamFormValues) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setIsLoading(false);
    onOpenChange(false);
    onSave(values, !!exam);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{exam ? "Edit Exam" : "Add Exam"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 pt-2">
          <TextField control={control} name="name" label="Exam Name" required />
          <TextField control={control} name="termName" label="Term Name" required />
          <TextField control={control} name="startDate" label="Start Date" type="date" required />
          <TextField control={control} name="endDate" label="End Date" type="date" required />
          <SelectField
            control={control}
            name="status"
            label="Status"
            options={EXAM_STATUS_OPTIONS}
            required
          />
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
