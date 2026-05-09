"use client";

import * as React from "react";
import {
  type Control,
  type FieldPath,
  type FieldValues,
  useController,
} from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps<T extends FieldValues = FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * SelectField<T> — RHF-integrated select dropdown using @base-ui Select primitives.
 */
export function SelectField<T extends FieldValues = FieldValues>({
  control,
  name,
  label,
  options,
  placeholder,
  description,
  required = false,
  disabled = false,
  className,
}: SelectFieldProps<T>) {
  const id = React.useId();
  const { field, fieldState } = useController({ name, control });
  const errorMessage = fieldState.error?.message;
  const fieldValue = field.value as string | undefined;
  const fieldOnChange = field.onChange;
  const fieldOnBlur = field.onBlur;
  const fieldRef = field.ref;

  return (
    <div className={cn("space-y-1.5", className)} data-slot="select-field">
      <Label htmlFor={id}>
        {label}
        {required && (
          <span className="text-destructive ms-0.5" aria-hidden>
            *
          </span>
        )}
      </Label>
      <Select
        value={fieldValue ?? ""}
        onValueChange={fieldOnChange}
        disabled={disabled}
      >
        <SelectTrigger
          id={id}
          aria-invalid={!!errorMessage}
          aria-describedby={
            errorMessage
              ? `${id}-error`
              : description
              ? `${id}-desc`
              : undefined
          }
          onBlur={fieldOnBlur}
          ref={fieldRef}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
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
