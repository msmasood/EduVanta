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
  incomeHeadFormSchema,
  type IncomeHeadFormValues,
} from "@/lib/validations/finance";
import { FINANCE_STATUS_OPTIONS } from "../utils/finance-form-options";
import type { IncomeHead } from "@/types/finance";

interface IncomeHeadFormDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  head?: IncomeHead;
  onSave: (values: IncomeHeadFormValues, isEdit: boolean) => void;
}

export function IncomeHeadFormDialog({
  open,
  onOpenChange,
  head,
  onSave,
}: IncomeHeadFormDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const isEdit = !!head;

  const { control, handleSubmit, reset } = useForm<IncomeHeadFormValues>({
    resolver: zodResolver(incomeHeadFormSchema),
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

  const onSubmit = async (values: IncomeHeadFormValues) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    setIsLoading(false);
    onSave(values, isEdit);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Income Head" : "Add Income Head"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <TextField
            control={control}
            name="name"
            label="Head Name"
            placeholder="e.g. Fee Collection"
            required
          />
          <TextField
            control={control}
            name="code"
            label="Code"
            placeholder="e.g. IH-FEE"
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
