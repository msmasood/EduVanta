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
import {
  TextField,
  TextareaField,
  SelectField,
  CurrencyField,
  DatePickerField,
  FormActions,
} from "@/components/forms";
import { expenseFormSchema, type ExpenseFormValues } from "@/lib/validations/finance";
import {
  FINANCE_EXPENSE_STATUS_OPTIONS,
  FINANCE_PAYMENT_METHOD_OPTIONS,
} from "../utils/finance-form-options";
import type { ExpenseHead } from "@/types/finance";
import type { ExpenseRecordRow } from "../utils/finance-mappers";

interface ExpenseFormDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  expenseHeads: ExpenseHead[];
  expense?: ExpenseRecordRow;
  onSave: (values: ExpenseFormValues, isEdit: boolean) => void;
}

export function ExpenseFormDialog({
  open,
  onOpenChange,
  expenseHeads,
  expense,
  onSave,
}: ExpenseFormDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const isEdit = !!expense;

  const headOptions = expenseHeads.map((h) => ({ label: h.name, value: h.id }));

  const { control, handleSubmit, reset } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      expenseHeadId: "",
      title: "",
      amount: 0,
      currency: "PKR",
      paidTo: "",
      paymentMethod: "cash",
      expenseDate: "",
      referenceNumber: "",
      notes: "",
      status: "pending",
    },
  });

  React.useEffect(() => {
    if (open) {
      reset(
        expense
          ? {
              expenseHeadId: expense.expenseHeadId,
              title: expense.title,
              amount: expense.amount,
              currency: expense.currency as ExpenseFormValues["currency"],
              paidTo: expense.paidTo !== "—" ? expense.paidTo : "",
              paymentMethod: expense.paymentMethod as ExpenseFormValues["paymentMethod"],
              expenseDate: expense.date,
              referenceNumber: expense.referenceNumber !== "—" ? expense.referenceNumber : "",
              notes: "",
              status: expense.status as ExpenseFormValues["status"],
            }
          : {
              expenseHeadId: "",
              title: "",
              amount: 0,
              currency: "PKR",
              paidTo: "",
              paymentMethod: "cash",
              expenseDate: "",
              referenceNumber: "",
              notes: "",
              status: "pending",
            }
      );
    }
  }, [expense, open, reset]);

  const onSubmit = async (values: ExpenseFormValues) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    setIsLoading(false);
    onSave(values, isEdit);
  };

  // CurrencyField is generic — cast needed for strict TS compatibility
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const currencyControl = control as any;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Expense Record" : "Add Expense"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <SelectField
            control={control}
            name="expenseHeadId"
            label="Expense Head"
            options={headOptions}
            placeholder="Select expense head"
            required
          />
          <TextField
            control={control}
            name="title"
            label="Title"
            placeholder="e.g. September Electricity Bill"
            required
          />
          <CurrencyField
            control={currencyControl}
            amountName="amount"
            currencyName="currency"
            label="Amount"
            required
          />
          <TextField
            control={control}
            name="paidTo"
            label="Paid To"
            placeholder="e.g. KESC Electricity Board"
          />
          <SelectField
            control={control}
            name="paymentMethod"
            label="Payment Method"
            options={FINANCE_PAYMENT_METHOD_OPTIONS}
            required
          />
          <DatePickerField
            control={control}
            name="expenseDate"
            label="Expense Date"
            required
          />
          <TextField
            control={control}
            name="referenceNumber"
            label="Reference Number"
            placeholder="e.g. KESC-SEP-2024"
          />
          <TextareaField
            control={control}
            name="notes"
            label="Notes"
            placeholder="Optional notes"
          />
          <SelectField
            control={control}
            name="status"
            label="Status"
            options={FINANCE_EXPENSE_STATUS_OPTIONS}
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
