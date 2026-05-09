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
import { sectionFormSchema, type SectionFormValues } from "@/lib/validations/academic";
import { STATUS_OPTIONS } from "../utils/academic-form-options";
import type { Section, ClassLevel, Classroom } from "@/types/academic";
import type { Teacher } from "@/types/teacher";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  section?: Section;
  classes: ClassLevel[];
  classrooms: Classroom[];
  teachers: Teacher[];
  onSave: (values: SectionFormValues, isEdit: boolean) => void;
}

export function SectionFormDialog({
  open,
  onOpenChange,
  section,
  classes,
  classrooms,
  teachers,
  onSave,
}: Props) {
  const [isLoading, setIsLoading] = React.useState(false);

  const classOptions = classes.map((c) => ({ label: c.name, value: c.id }));
  const classroomOptions = [
    { label: "None", value: "" },
    ...classrooms.map((r) => ({ label: `${r.name} (${r.code})`, value: r.id })),
  ];
  const teacherOptions = [
    { label: "None", value: "" },
    ...teachers.map((t) => ({ label: `${t.firstName} ${t.lastName}`, value: t.id })),
  ];

  const { control, handleSubmit, reset } = useForm<SectionFormValues>({
    resolver: zodResolver(sectionFormSchema),
    defaultValues: {
      name: "",
      code: "",
      classId: "",
      classroomId: "",
      teacherId: "",
      capacity: 35,
      status: "active",
    },
  });

  React.useEffect(() => {
    if (section) {
      reset({
        name: section.name,
        code: section.code,
        classId: section.classId,
        classroomId: section.classroomId ?? "",
        teacherId: section.teacherId ?? "",
        capacity: section.capacity,
        status: section.status,
      });
    } else {
      reset({ name: "", code: "", classId: "", classroomId: "", teacherId: "", capacity: 35, status: "active" });
    }
  }, [section, reset, open]);

  const onSubmit = async (values: SectionFormValues) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setIsLoading(false);
    onOpenChange(false);
    onSave(values, !!section);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{section ? "Edit Section" : "Add Section"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 pt-2">
          <TextField control={control} name="name" label="Section Name" required />
          <TextField control={control} name="code" label="Section Code" required />
          <SelectField
            control={control}
            name="classId"
            label="Class"
            options={classOptions}
            required
          />
          <SelectField
            control={control}
            name="classroomId"
            label="Classroom"
            options={classroomOptions}
          />
          <SelectField
            control={control}
            name="teacherId"
            label="Class Teacher"
            options={teacherOptions}
          />
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
