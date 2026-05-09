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
import { examScheduleFormSchema, type ExamScheduleFormValues } from "@/lib/validations/exams";
import type { Exam } from "@/types/exams";
import type { Subject, ClassLevel } from "@/types/academic";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  schedule?: ExamScheduleFormValues & { id?: string };
  exams: Exam[];
  subjects: Subject[];
  classes: ClassLevel[];
  onSave: (values: ExamScheduleFormValues, isEdit: boolean) => void;
}

export function ExamScheduleFormDialog({
  open,
  onOpenChange,
  schedule,
  exams,
  subjects,
  classes,
  onSave,
}: Props) {
  const [isLoading, setIsLoading] = React.useState(false);

  const examOptions = exams.map((e) => ({ label: e.name, value: e.id }));
  const subjectOptions = subjects.map((s) => ({ label: s.name, value: s.id }));
  const classOptions = classes.map((c) => ({ label: c.name, value: c.id }));

  const { control, handleSubmit, reset } = useForm<ExamScheduleFormValues>({
    resolver: zodResolver(examScheduleFormSchema),
    defaultValues: {
      examId: "",
      subjectId: "",
      classId: "",
      date: "",
      startTime: "",
      endTime: "",
      classroomId: "",
      maxMarks: undefined,
      passingMarks: undefined,
    },
  });

  React.useEffect(() => {
    if (schedule) {
      reset({
        examId: schedule.examId,
        subjectId: schedule.subjectId,
        classId: schedule.classId,
        date: schedule.date,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        classroomId: schedule.classroomId ?? "",
        maxMarks: schedule.maxMarks,
        passingMarks: schedule.passingMarks,
      });
    } else {
      reset({
        examId: "",
        subjectId: "",
        classId: "",
        date: "",
        startTime: "",
        endTime: "",
        classroomId: "",
        maxMarks: undefined,
        passingMarks: undefined,
      });
    }
  }, [schedule, reset, open]);

  const onSubmit = async (values: ExamScheduleFormValues) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setIsLoading(false);
    onOpenChange(false);
    onSave(values, !!schedule);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{schedule ? "Edit Schedule" : "Add Schedule"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 pt-2">
          <SelectField
            control={control}
            name="examId"
            label="Exam"
            options={examOptions}
            required
          />
          <SelectField
            control={control}
            name="subjectId"
            label="Subject"
            options={subjectOptions}
            required
          />
          <SelectField
            control={control}
            name="classId"
            label="Class"
            options={classOptions}
            required
          />
          <TextField control={control} name="date" label="Date" type="date" required />
          <TextField control={control} name="startTime" label="Start Time" type="time" required />
          <TextField control={control} name="endTime" label="End Time" type="time" required />
          <TextField control={control} name="maxMarks" label="Max Marks" type="number" required />
          <TextField control={control} name="passingMarks" label="Passing Marks" type="number" required />
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
