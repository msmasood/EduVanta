"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatCurrency, type CurrencyCode } from "@/lib/currency";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CurrencyField, SelectField, TextareaField, TextField, FormActions } from "@/components/forms";
import { feePaymentSchema, type FeePaymentFormValues } from "@/lib/validations/fees";
import { FEE_PAYMENT_METHOD_OPTIONS } from "../utils/fee-form-options";
import type { FeeInvoiceRow } from "../utils/fee-mappers";

interface FeePaymentDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  invoice?: FeeInvoiceRow;
  onSave: (values: FeePaymentFormValues) => void;
}

/**
 * FeePaymentDialog — RHF + Zod form for collecting a fee payment.
 * Mock-only: shows a Sonner toast on submit; no real payment processing.
 */
export function FeePaymentDialog({
  open,
  onOpenChange,
  invoice,
  onSave,
}: FeePaymentDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const today = React.useMemo(() => new Date().toISOString().split("T")[0], []);

  const { control, handleSubmit, reset } = useForm<FeePaymentFormValues>({
    resolver: zodResolver(feePaymentSchema),
    defaultValues: {
      invoiceId: "",
      studentId: "",
      amount: 0,
      currency: "PKR",
      paymentMethod: "cash",
      paymentDate: today,
      referenceNumber: "",
      notes: "",
    },
  });

  React.useEffect(() => {
    if (invoice) {
      reset({
        invoiceId: invoice.id,
        studentId: invoice.studentId,
        amount: invoice.balance > 0 ? invoice.balance : invoice.netAmount,
        currency: invoice.currency as FeePaymentFormValues["currency"],
        paymentMethod: "cash",
        paymentDate: today,
        referenceNumber: "",
        notes: "",
      });
    } else {
      reset({
        invoiceId: "",
        studentId: "",
        amount: 0,
        currency: "PKR",
        paymentMethod: "cash",
        paymentDate: today,
        referenceNumber: "",
        notes: "",
      });
    }
  }, [invoice, reset, open, today]);

  const onSubmit = async (values: FeePaymentFormValues) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setIsLoading(false);
    onOpenChange(false);
    onSave(values);
  };

  const amountDue = invoice
    ? formatCurrency(
        invoice.balance > 0 ? invoice.balance : invoice.netAmount,
        invoice.currency as CurrencyCode,
        "en"
      )
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Collect Payment</DialogTitle>
        </DialogHeader>

        {invoice && amountDue && (
          <div className="rounded-md bg-muted px-4 py-3 text-sm">
            <p className="font-medium">{invoice.invoiceNumber}</p>
            <p className="text-muted-foreground">{invoice.studentName}</p>
            <p className="mt-1">
              Amount Due:{" "}
              <span className="font-semibold text-foreground">{amountDue}</span>
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <CurrencyField
            control={control}
            amountName="amount"
            currencyName="currency"
            label="Payment Amount"
            required
          />
          <SelectField
            control={control}
            name="paymentMethod"
            label="Payment Method"
            options={FEE_PAYMENT_METHOD_OPTIONS}
            required
          />
          <TextField
            control={control}
            name="paymentDate"
            label="Payment Date"
            type="date"
            required
          />
          <TextField
            control={control}
            name="referenceNumber"
            label="Reference Number"
            placeholder="Optional transaction ref"
          />
          <TextareaField control={control} name="notes" label="Notes" />
          <FormActions
            isLoading={isLoading}
            showCancel
            onCancel={() => onOpenChange(false)}
            submitLabel="Collect Payment"
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
