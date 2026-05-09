"use client";

import * as React from "react";
import { useForm, useController } from "react-hook-form";
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
  FormActions,
} from "@/components/forms";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { feeDiscountFormSchema, type FeeDiscountFormValues } from "@/lib/validations/fees";
import { FEE_STATUS_OPTIONS, FEE_DISCOUNT_TYPE_OPTIONS } from "../utils/fee-form-options";
import type { FeeDiscount } from "@/types/fees";

interface FeeDiscountFormDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  discount?: FeeDiscount;
  onSave: (values: FeeDiscountFormValues, isEdit: boolean) => void;
}

/**
 * FeeDiscountFormDialog — create or edit a fee discount.
 * Note: existing FeeDiscount mock type does not include code/status/dates;
 * those default to empty/active for existing discounts.
 */
export function FeeDiscountFormDialog({
  open,
  onOpenChange,
  discount,
  onSave,
}: FeeDiscountFormDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const { control, handleSubmit, reset } = useForm<FeeDiscountFormValues>({
    resolver: zodResolver(feeDiscountFormSchema),
    defaultValues: {
      name: "",
      code: "",
      discountType: "percentage",
      value: 0,
      status: "active",
      description: "",
    },
  });

  // Controlled numeric field — converts input string to number so z.number() works
  const { field: valueField, fieldState: valueFieldState } = useController({
    name: "value",
    control,
  });

  React.useEffect(() => {
    if (discount) {
      reset({
        name: discount.name,
        code: "",
        discountType: discount.discountType,
        value: discount.value,
        status: "active",
        description: "",
      });
    } else {
      reset({
        name: "",
        code: "",
        discountType: "percentage",
        value: 0,
        status: "active",
        description: "",
      });
    }
  }, [discount, reset, open]);

  const onSubmit = async (values: FeeDiscountFormValues) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setIsLoading(false);
    onOpenChange(false);
    onSave(values, !!discount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {discount ? "Edit Fee Discount" : "Add Fee Discount"}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4 pt-2"
        >
          <TextField control={control} name="name" label="Discount Name" required />
          <TextField
            control={control}
            name="code"
            label="Code"
            required
            placeholder="e.g. SCHOLARSHIP-100"
          />
          <SelectField
            control={control}
            name="discountType"
            label="Discount Type"
            options={FEE_DISCOUNT_TYPE_OPTIONS}
            required
          />
          {/* Numeric field — manually converts string to number for z.number() */}
          <div className="space-y-1.5">
            <Label>
              Value (% or fixed amount){" "}
              <span className="text-destructive ms-0.5" aria-hidden>*</span>
            </Label>
            <Input
              type="number"
              min={0}
              step="any"
              placeholder="e.g. 50 for 50% or 1000 for fixed"
              value={valueField.value === 0 ? "" : String(valueField.value)}
              onChange={(e) =>
                valueField.onChange(e.target.value ? Number(e.target.value) : 0)
              }
              onBlur={valueField.onBlur}
              aria-invalid={!!valueFieldState.error?.message}
            />
            {valueFieldState.error?.message && (
              <p className="text-sm text-destructive">{valueFieldState.error.message}</p>
            )}
          </div>
          <TextField
            control={control}
            name="startDate"
            label="Start Date"
            type="date"
          />
          <TextField
            control={control}
            name="endDate"
            label="End Date"
            type="date"
          />
          <SelectField
            control={control}
            name="status"
            label="Status"
            options={FEE_STATUS_OPTIONS}
            required
          />
          <TextareaField control={control} name="description" label="Description" />
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
