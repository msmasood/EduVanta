"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SelectField, DatePickerField, FormActions } from "@/components/forms";
import { TextField } from "@/components/forms";
import { leaveRequestSchema, type LeaveRequestFormValues } from "@/lib/validations/employees";
import type { Employee } from "@/types/employee";
import type { LeaveType } from "@/types/leaves";

interface Props {
  employees: Employee[];
  leaveTypes: LeaveType[];
  onSubmit: () => void;
}

export function LeaveRequestFormDialog({ employees, leaveTypes, onSubmit }: Props) {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const employeeOptions = employees.map((e) => ({
    label: `${e.firstName} ${e.lastName} (${e.employeeCode})`,
    value: e.id,
  }));

  const leaveTypeOptions = leaveTypes
    .filter((t) => t.applicableTo.includes("employee"))
    .map((t) => ({ label: t.name, value: t.id }));

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeaveRequestFormValues>({
    resolver: zodResolver(leaveRequestSchema),
    defaultValues: {
      employeeId: "",
      leaveTypeId: "",
      startDate: "",
      endDate: "",
      reason: "",
    },
  });

  const handleFormSubmit = async (_values: LeaveRequestFormValues) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setIsLoading(false);
    setOpen(false);
    reset();
    onSubmit();
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm" className="gap-1.5">
        <Plus className="size-4" aria-hidden />
        Apply for Leave
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Apply for Leave</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate className="space-y-4 pt-2">
          <SelectField
            control={control}
            name="employeeId"
            label="Employee"
            options={employeeOptions}
            required
          />
          <SelectField
            control={control}
            name="leaveTypeId"
            label="Leave Type"
            options={leaveTypeOptions}
            required
          />
          <DatePickerField control={control} name="startDate" label="Start Date" required />
          <DatePickerField control={control} name="endDate" label="End Date" required />
          <TextField
            control={control}
            name="reason"
            label="Reason"
            required
          />
          <FormActions
            isLoading={isLoading}
            showCancel
            onCancel={() => { setOpen(false); reset(); }}
            submitLabel="Submit Request"
          />
        </form>
      </DialogContent>
    </Dialog>
    </>
  );
}
