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
import { subjectFormSchema, type SubjectFormValues } from "@/lib/validations/academic";
import { STATUS_OPTIONS, SUBJECT_TYPE_OPTIONS } from "../utils/academic-form-options";
import type { Subject } from "@/types/academic";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  subject?: Subject;
  onSave: (values: SubjectFormValues, isEdit: boolean) => void;
}

export function SubjectFormDialog({ open, onOpenChange, subject, onSave }: Props) {
  const [isLoading, setIsLoading] = React.useState(false);

  const { control, handleSubmit, reset } = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectFormSchema),
    defaultValues: {
      name: "",
      code: "",
      type: "theory",
      creditHours: undefined,
      status: "active",
    },
  });

  React.useEffect(() => {
    if (subject) {
      reset({
        name: subject.name,
        code: subject.code,
        type: subject.type,
        creditHours: subject.creditHours,
        status: subject.status,
      });
    } else {
      reset({ name: "", code: "", type: "theory", creditHours: undefined, status: "active" });
    }
  }, [subject, reset, open]);

  const onSubmit = async (values: SubjectFormValues) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setIsLoading(false);
    onOpenChange(false);
    onSave(values, !!subject);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{subject ? "Edit Subject" : "Add Subject"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 pt-2">
          <TextField control={control} name="name" label="Subject Name" required />
          <TextField control={control} name="code" label="Subject Code" required />
          <SelectField
            control={control}
            name="type"
            label="Type"
            options={SUBJECT_TYPE_OPTIONS}
            required
          />
          <TextField control={control} name="creditHours" label="Credit Hours" type="number" />
          <SelectField
            control={control}
            name="status"
            label="Status"
            options={STATUS_OPTIONS}
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
