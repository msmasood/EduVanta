"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SelectField, FormActions } from "@/components/forms";
import { TextField } from "@/components/forms";
import { departmentSchema, type DepartmentFormValues } from "@/lib/validations/hrm";
import type { Department, Employee } from "@/types/employee";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  department?: Department;
  employees: Employee[];
  onSave: (isEdit: boolean) => void;
}

export function DepartmentFormDialog({
  open,
  onOpenChange,
  department,
  employees,
  onSave,
}: Props) {
  const [isLoading, setIsLoading] = React.useState(false);

  const employeeOptions = employees.map((e) => ({
    label: `${e.firstName} ${e.lastName} (${e.employeeCode})`,
    value: e.id,
  }));

  const { control, handleSubmit, reset } = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: department?.name ?? "",
      code: "",
      description: "",
      headEmployeeId: department?.headId ?? "",
      status: "active",
    },
  });

  React.useEffect(() => {
    if (department) {
      reset({ name: department.name, code: "", description: "", headEmployeeId: department.headId ?? "", status: "active" });
    } else {
      reset({ name: "", code: "", description: "", headEmployeeId: "", status: "active" });
    }
  }, [department, reset]);

  const onSubmit = async (_values: DepartmentFormValues) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setIsLoading(false);
    onOpenChange(false);
    onSave(!!department);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{department ? "Edit Department" : "Add Department"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 pt-2">
          <TextField control={control} name="name" label="Department Name" required />
          <TextField control={control} name="code" label="Department Code" required />
          <TextField control={control} name="description" label="Description" />
          <SelectField
            control={control}
            name="headEmployeeId"
            label="Department Head"
            options={[{ label: "— None —", value: "" }, ...employeeOptions]}
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
            submitLabel={department ? "Save Changes" : "Add Department"}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
