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
import { TextField, TextareaField, SelectField, FormActions } from "@/components/forms";
import {
  expenseHeadFormSchema,
  type ExpenseHeadFormValues,
} from "@/lib/validations/finance";
import { FINANCE_STATUS_OPTIONS } from "../utils/finance-form-options";
import type { ExpenseHead } from "@/types/finance";

interface ExpenseHeadFormDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  head?: ExpenseHead;
  onSave: (values: ExpenseHeadFormValues, isEdit: boolean) => void;
}

export function ExpenseHeadFormDialog({
  open,
  onOpenChange,
  head,
  onSave,
}: ExpenseHeadFormDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const isEdit = !!head;

  const { control, handleSubmit, reset } = useForm<ExpenseHeadFormValues>({
    resolver: zodResolver(expenseHeadFormSchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      status: "active",
    },
  });

  React.useEffect(() => {
    if (open) {
      reset(
        head
          ? {
              name: head.name,
              code: head.code ?? "",
              description: head.description ?? "",
              status: head.status ?? "active",
            }
          : { name: "", code: "", description: "", status: "active" }
      );
    }
  }, [head, open, reset]);

  const onSubmit = async (values: ExpenseHeadFormValues) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    setIsLoading(false);
    onSave(values, isEdit);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Expense Head" : "Add Expense Head"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <TextField
            control={control}
            name="name"
            label="Head Name"
            placeholder="e.g. Staff Salaries"
            required
          />
          <TextField
            control={control}
            name="code"
            label="Code"
            placeholder="e.g. EH-SAL"
            required
          />
          <TextareaField
            control={control}
            name="description"
            label="Description"
            placeholder="Optional description"
          />
          <SelectField
            control={control}
            name="status"
            label="Status"
            options={FINANCE_STATUS_OPTIONS}
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
