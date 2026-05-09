"use client";

import * as React from "react";
import {
  type Control,
  type FieldPath,
  type FieldValues,
  useController,
} from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CURRENCIES, CURRENCY_CODES } from "@/lib/currency";
import { cn } from "@/lib/utils";

interface CurrencyFieldProps<T extends FieldValues = FieldValues> {
  control: Control<T>;
  /** Field name for the numeric amount */
  amountName: FieldPath<T>;
  /** Field name for the currency code string */
  currencyName: FieldPath<T>;
  label: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * CurrencyField<T> — dual-input field combining a numeric amount with a
 * currency code selector. Binds two separate RHF fields.
 */
export function CurrencyField<T extends FieldValues = FieldValues>({
  control,
  amountName,
  currencyName,
  label,
  description,
  required = false,
  disabled = false,
  className,
}: CurrencyFieldProps<T>) {
  const id = React.useId();
  const { field: amountField, fieldState: amountState } = useController({
    name: amountName,
    control,
  });
  const { field: currencyField } = useController({
    name: currencyName,
    control,
  });

  const errorMessage = amountState.error?.message;
  const currencyValue = currencyField.value as string | undefined;
  const currencyOnChange = currencyField.onChange;
  const currencyOnBlur = currencyField.onBlur;
  const currencyRef = currencyField.ref;

  return (
    <div className={cn("space-y-1.5", className)} data-slot="currency-field">
      <Label htmlFor={id}>
        {label}
        {required && (
          <span className="text-destructive ms-0.5" aria-hidden>
            *
          </span>
        )}
      </Label>
      <div className="flex gap-2">
        {/* Currency selector */}
        <Select
          value={currencyValue ?? "USD"}
          onValueChange={currencyOnChange}
          disabled={disabled}
        >
          <SelectTrigger
            className="h-8 w-24 shrink-0"
            aria-label="Currency"
            onBlur={currencyOnBlur}
            ref={currencyRef}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CURRENCY_CODES.map((code) => (
              <SelectItem key={code} value={code}>
                {code} ({CURRENCIES[code].symbol})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Amount input */}
        <Input
          id={id}
          type="number"
          min={0}
          step="any"
          placeholder="0.00"
          disabled={disabled}
          aria-invalid={!!errorMessage}
          aria-describedby={
            errorMessage
              ? `${id}-error`
              : description
              ? `${id}-desc`
              : undefined
          }
          className="flex-1"
          {...amountField}
          value={amountField.value ?? ""}
        />
      </div>
      {description && !errorMessage && (
        <p id={`${id}-desc`} className="text-xs text-muted-foreground">
          {description}
        </p>
      )}
      {errorMessage && (
        <p id={`${id}-error`} role="alert" className="text-xs text-destructive">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
