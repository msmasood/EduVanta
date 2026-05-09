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
import { classFormSchema, type ClassFormValues } from "@/lib/validations/academic";
import { STATUS_OPTIONS } from "../utils/academic-form-options";
import type { ClassLevel } from "@/types/academic";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  classLevel?: ClassLevel;
  onSave: (values: ClassFormValues, isEdit: boolean) => void;
}

export function ClassFormDialog({ open, onOpenChange, classLevel, onSave }: Props) {
  const [isLoading, setIsLoading] = React.useState(false);

  const { control, handleSubmit, reset } = useForm<ClassFormValues>({
    resolver: zodResolver(classFormSchema),
    defaultValues: {
      name: "",
      code: "",
      order: undefined,
      capacity: undefined,
      description: "",
      status: "active",
    },
  });

  React.useEffect(() => {
    if (classLevel) {
      reset({
        name: classLevel.name,
        code: classLevel.code ?? "",
        order: classLevel.order,
        capacity: classLevel.capacity,
        description: classLevel.description ?? "",
        status: classLevel.status,
      });
    } else {
      reset({ name: "", code: "", order: undefined, capacity: undefined, description: "", status: "active" });
    }
  }, [classLevel, reset, open]);

  const onSubmit = async (values: ClassFormValues) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setIsLoading(false);
    onOpenChange(false);
    onSave(values, !!classLevel);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{classLevel ? "Edit Class" : "Add Class"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 pt-2">
          <TextField control={control} name="name" label="Class Name" required />
          <TextField control={control} name="code" label="Class Code" required />
          <TextField control={control} name="order" label="Display Order" type="number" />
          <TextField control={control} name="capacity" label="Total Capacity" type="number" />
          <TextField control={control} name="description" label="Description" />
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
