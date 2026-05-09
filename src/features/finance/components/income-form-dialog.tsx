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
import { incomeFormSchema, type IncomeFormValues } from "@/lib/validations/finance";
import {
  FINANCE_INCOME_STATUS_OPTIONS,
  FINANCE_PAYMENT_METHOD_OPTIONS,
} from "../utils/finance-form-options";
import type { IncomeHead } from "@/types/finance";
import type { IncomeRecordRow } from "../utils/finance-mappers";

interface IncomeFormDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  incomeHeads: IncomeHead[];
  income?: IncomeRecordRow;
  onSave: (values: IncomeFormValues, isEdit: boolean) => void;
}

export function IncomeFormDialog({
  open,
  onOpenChange,
  incomeHeads,
  income,
  onSave,
}: IncomeFormDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const isEdit = !!income;

  const headOptions = incomeHeads.map((h) => ({ label: h.name, value: h.id }));

  const { control, handleSubmit, reset } = useForm<IncomeFormValues>({
    resolver: zodResolver(incomeFormSchema),
    defaultValues: {
      incomeHeadId: "",
      title: "",
      amount: 0,
      currency: "PKR",
      receivedFrom: "",
      paymentMethod: "cash",
      incomeDate: "",
      referenceNumber: "",
      notes: "",
      status: "pending",
    },
  });

  React.useEffect(() => {
    if (open) {
      reset(
        income
          ? {
              incomeHeadId: income.incomeHeadId,
              title: income.title,
              amount: income.amount,
              currency: income.currency as IncomeFormValues["currency"],
              receivedFrom: income.receivedFrom !== "—" ? income.receivedFrom : "",
              paymentMethod: income.paymentMethod as IncomeFormValues["paymentMethod"],
              incomeDate: income.date,
              referenceNumber: income.referenceNumber !== "—" ? income.referenceNumber : "",
              notes: "",
              status: income.status as IncomeFormValues["status"],
            }
          : {
              incomeHeadId: "",
              title: "",
              amount: 0,
              currency: "PKR",
              receivedFrom: "",
              paymentMethod: "cash",
              incomeDate: "",
              referenceNumber: "",
              notes: "",
              status: "pending",
            }
      );
    }
  }, [income, open, reset]);

  const onSubmit = async (values: IncomeFormValues) => {
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
          <DialogTitle>{isEdit ? "Edit Income Record" : "Add Income"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <SelectField
            control={control}
            name="incomeHeadId"
            label="Income Head"
            options={headOptions}
            placeholder="Select income head"
            required
          />
          <TextField
            control={control}
            name="title"
            label="Title"
            placeholder="e.g. Annual Fundraiser Donation"
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
            name="receivedFrom"
            label="Received From"
            placeholder="e.g. Ali Foundation"
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
            name="incomeDate"
            label="Income Date"
            required
          />
          <TextField
            control={control}
            name="referenceNumber"
            label="Reference Number"
            placeholder="e.g. TXN-001"
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
            options={FINANCE_INCOME_STATUS_OPTIONS}
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
