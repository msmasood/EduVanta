"use client";

import * as React from "react";
import {
  type Control,
  type FieldPath,
  type FieldValues,
  useController,
} from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface CheckboxFieldProps<T extends FieldValues = FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * CheckboxField<T> — RHF-integrated checkbox using @base-ui Checkbox.
 * The boolean `field.value` maps to `checked`, `field.onChange` to `onCheckedChange`.
 */
export function CheckboxField<T extends FieldValues = FieldValues>({
  control,
  name,
  label,
  description,
  required = false,
  disabled = false,
  className,
}: CheckboxFieldProps<T>) {
  const id = React.useId();
  const { field, fieldState } = useController({ name, control });
  const errorMessage = fieldState.error?.message;
  const fieldValue = field.value as boolean | undefined;
  const fieldOnChange = field.onChange;
  const fieldOnBlur = field.onBlur;
  const fieldRef = field.ref;

  return (
    <div className={cn("space-y-1.5", className)} data-slot="checkbox-field">
      <div className="flex items-start gap-2">
        <Checkbox
          id={id}
          checked={!!fieldValue}
          onCheckedChange={(v) => fieldOnChange(v === true)}
          disabled={disabled}
          aria-invalid={!!errorMessage}
          aria-describedby={
            errorMessage
              ? `${id}-error`
              : description
              ? `${id}-desc`
              : undefined
          }
          ref={fieldRef}
          onBlur={fieldOnBlur}
          className="mt-0.5"
        />
        <div className="space-y-0.5">
          <Label htmlFor={id} className="text-sm font-medium leading-none">
            {label}
            {required && (
              <span className="text-destructive ms-0.5" aria-hidden>
                *
              </span>
            )}
          </Label>
          {description && !errorMessage && (
            <p
              id={`${id}-desc`}
              className="text-xs text-muted-foreground"
            >
              {description}
            </p>
          )}
        </div>
      </div>
      {errorMessage && (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-xs text-destructive ps-6"
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
}
