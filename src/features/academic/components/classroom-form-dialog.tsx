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
import { classroomFormSchema, type ClassroomFormValues } from "@/lib/validations/academic";
import { STATUS_OPTIONS, CLASSROOM_TYPE_OPTIONS } from "../utils/academic-form-options";
import type { Classroom } from "@/types/academic";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  classroom?: Classroom;
  onSave: (values: ClassroomFormValues, isEdit: boolean) => void;
}

export function ClassroomFormDialog({ open, onOpenChange, classroom, onSave }: Props) {
  const [isLoading, setIsLoading] = React.useState(false);

  const { control, handleSubmit, reset } = useForm<ClassroomFormValues>({
    resolver: zodResolver(classroomFormSchema),
    defaultValues: {
      name: "",
      code: "",
      type: "classroom",
      building: "",
      floor: "",
      capacity: 30,
      status: "active",
    },
  });

  React.useEffect(() => {
    if (classroom) {
      reset({
        name: classroom.name,
        code: classroom.code,
        type: classroom.type,
        building: classroom.building ?? "",
        floor: classroom.floor ?? "",
        capacity: classroom.capacity,
        status: classroom.status,
      });
    } else {
      reset({ name: "", code: "", type: "classroom", building: "", floor: "", capacity: 30, status: "active" });
    }
  }, [classroom, reset, open]);

  const onSubmit = async (values: ClassroomFormValues) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setIsLoading(false);
    onOpenChange(false);
    onSave(values, !!classroom);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{classroom ? "Edit Classroom" : "Add Classroom"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 pt-2">
          <TextField control={control} name="name" label="Room Name" required />
          <TextField control={control} name="code" label="Room Code" required />
          <SelectField
            control={control}
            name="type"
            label="Type"
            options={CLASSROOM_TYPE_OPTIONS}
            required
          />
          <TextField control={control} name="building" label="Building / Block" />
          <TextField control={control} name="floor" label="Floor" />
          <TextField control={control} name="capacity" label="Capacity" type="number" required />
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
