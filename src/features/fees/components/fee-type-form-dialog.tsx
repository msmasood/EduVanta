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
  SelectField,
  TextareaField,
  CurrencyField,
  FormActions,
} from "@/components/forms";
import { feeTypeFormSchema, type FeeTypeFormValues } from "@/lib/validations/fees";
import { FEE_STATUS_OPTIONS, FEE_FREQUENCY_OPTIONS } from "../utils/fee-form-options";
import type { FeeType, FeeGroup } from "@/types/fees";

interface FeeTypeFormDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  feeType?: FeeType;
  feeGroups: FeeGroup[];
  onSave: (values: FeeTypeFormValues, isEdit: boolean) => void;
}

/**
 * FeeTypeFormDialog — create or edit a fee type.
 * Uses CurrencyField for amount+currency to ensure z.number() compatibility.
 */
export function FeeTypeFormDialog({
  open,
  onOpenChange,
  feeType,
  feeGroups,
  onSave,
}: FeeTypeFormDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const groupOptions = feeGroups.map((g) => ({ label: g.name, value: g.id }));

  const { control, handleSubmit, reset } = useForm<FeeTypeFormValues>({
    resolver: zodResolver(feeTypeFormSchema),
    defaultValues: {
      name: "",
      code: "",
      groupId: "",
      amount: 0,
      currency: "PKR",
      frequency: "monthly",
      description: "",
      status: "active",
    },
  });

  React.useEffect(() => {
    if (feeType) {
      reset({
        name: feeType.name,
        code: "",
        groupId: feeType.feeGroupId,
        amount: feeType.amount.amount,
        currency: feeType.amount.currency as FeeTypeFormValues["currency"],
        frequency: (feeType.frequency ?? "monthly") as FeeTypeFormValues["frequency"],
        description: "",
        status: "active",
      });
    } else {
      reset({
        name: "",
        code: "",
        groupId: "",
        amount: 0,
        currency: "PKR",
        frequency: "monthly",
        description: "",
        status: "active",
      });
    }
  }, [feeType, reset, open]);

  const onSubmit = async (values: FeeTypeFormValues) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setIsLoading(false);
    onOpenChange(false);
    onSave(values, !!feeType);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{feeType ? "Edit Fee Type" : "Add Fee Type"}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4 pt-2"
        >
          <TextField control={control} name="name" label="Type Name" required />
          <TextField
            control={control}
            name="code"
            label="Code"
            required
            placeholder="e.g. MONTHLY-TUITION"
          />
          {groupOptions.length > 0 && (
            <SelectField
              control={control}
              name="groupId"
              label="Fee Group"
              options={groupOptions}
              placeholder="Select group"
            />
          )}
          <CurrencyField
            control={control}
            amountName="amount"
            currencyName="currency"
            label="Amount"
            required
          />
          <SelectField
            control={control}
            name="frequency"
            label="Frequency"
            options={FEE_FREQUENCY_OPTIONS}
            required
          />
          <TextareaField control={control} name="description" label="Description" />
          <SelectField
            control={control}
            name="status"
            label="Status"
            options={FEE_STATUS_OPTIONS}
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
