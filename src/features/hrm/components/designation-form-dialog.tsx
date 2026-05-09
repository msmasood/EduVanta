"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SelectField, FormActions } from "@/components/forms";
import { TextField } from "@/components/forms";
import { designationSchema, type DesignationFormValues } from "@/lib/validations/hrm";
import type { Designation, Department } from "@/types/employee";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  designation?: Designation;
  departments: Department[];
  onSave: (isEdit: boolean) => void;
}

export function DesignationFormDialog({
  open,
  onOpenChange,
  designation,
  departments,
  onSave,
}: Props) {
  const [isLoading, setIsLoading] = React.useState(false);

  const departmentOptions = departments.map((d) => ({ label: d.name, value: d.id }));

  const { control, handleSubmit, reset } = useForm<DesignationFormValues>({
    resolver: zodResolver(designationSchema),
    defaultValues: {
      title: designation?.name ?? "",
      code: "",
      departmentId: designation?.departmentId ?? "",
      status: "active",
    },
  });

  React.useEffect(() => {
    if (designation) {
      reset({ title: designation.name, code: "", departmentId: designation.departmentId ?? "", status: "active" });
    } else {
      reset({ title: "", code: "", departmentId: "", status: "active" });
    }
  }, [designation, reset]);

  const onSubmit = async (_values: DesignationFormValues) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setIsLoading(false);
    onOpenChange(false);
    onSave(!!designation);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{designation ? "Edit Designation" : "Add Designation"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 pt-2">
          <TextField control={control} name="title" label="Title" required />
          <TextField control={control} name="code" label="Code" required />
          <SelectField
            control={control}
            name="departmentId"
            label="Department"
            options={[{ label: "— None —", value: "" }, ...departmentOptions]}
          />
          <SelectField
            control={control}
            name="status"
            label="Status"
            options={[
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ]}
          />
          <FormActions
            isLoading={isLoading}
            showCancel
            onCancel={() => onOpenChange(false)}
            submitLabel={designation ? "Save Changes" : "Add Designation"}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
