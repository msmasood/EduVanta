"use client";

import * as React from "react";
import {
  type Control,
  type FieldPath,
  type FieldValues,
  useController,
} from "react-hook-form";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface TextareaFieldProps<T extends FieldValues = FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  className?: string;
}

/**
 * TextareaField<T> — RHF-integrated textarea with label, description, and error.
 */
export function TextareaField<T extends FieldValues = FieldValues>({
  control,
  name,
  label,
  placeholder,
  description,
  required = false,
  disabled = false,
  rows = 4,
  className,
}: TextareaFieldProps<T>) {
  const id = React.useId();
  const { field, fieldState } = useController({ name, control });
  const errorMessage = fieldState.error?.message;

  return (
    <div className={cn("space-y-1.5", className)} data-slot="textarea-field">
      <Label htmlFor={id}>
        {label}
        {required && (
          <span className="text-destructive ms-0.5" aria-hidden>
            *
          </span>
        )}
      </Label>
      <Textarea
        id={id}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
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
