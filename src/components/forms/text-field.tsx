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
import { cn } from "@/lib/utils";

interface TextFieldProps<T extends FieldValues = FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  type?: React.HTMLInputTypeAttribute;
  className?: string;
}

/**
 * TextField<T> — RHF-integrated text input with label, description, and error.
 */
export function TextField<T extends FieldValues = FieldValues>({
  control,
  name,
  label,
  placeholder,
  description,
  required = false,
  disabled = false,
  type = "text",
  className,
}: TextFieldProps<T>) {
  const id = React.useId();
  const { field, fieldState } = useController({ name, control });
  const errorMessage = fieldState.error?.message;

  return (
    <div className={cn("space-y-1.5", className)} data-slot="text-field">
      <Label htmlFor={id}>
        {label}
        {required && (
          <span className="text-destructive ms-0.5" aria-hidden>
            *
          </span>
        )}
      </Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={!!errorMessage}
        aria-describedby={
          errorMessage
            ? `${id}-error`
            : description
            ? `${id}-desc`
            : undefined
        }
        {...field}
        value={field.value ?? ""}
      />
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
