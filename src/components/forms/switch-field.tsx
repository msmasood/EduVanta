"use client";

import * as React from "react";
import {
  type Control,
  type FieldPath,
  type FieldValues,
  useController,
} from "react-hook-form";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface SwitchFieldProps<T extends FieldValues = FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * SwitchField<T> — RHF-integrated toggle switch using @base-ui Switch.
 */
export function SwitchField<T extends FieldValues = FieldValues>({
  control,
  name,
  label,
  description,
  required = false,
  disabled = false,
  className,
}: SwitchFieldProps<T>) {
  const id = React.useId();
  const { field, fieldState } = useController({ name, control });
  const errorMessage = fieldState.error?.message;
  const fieldValue = field.value as boolean | undefined;
  const fieldOnChange = field.onChange;
  const fieldOnBlur = field.onBlur;
  const fieldRef = field.ref;

  return (
    <div
      className={cn("flex items-start justify-between gap-4", className)}
      data-slot="switch-field"
    >
      <div className="space-y-0.5">
        <Label htmlFor={id} className="text-sm font-medium leading-none">
          {label}
          {required && (
            <span className="text-destructive ms-0.5" aria-hidden>
              *
            </span>
          )}
        </Label>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        {errorMessage && (
          <p role="alert" className="text-xs text-destructive">
            {errorMessage}
          </p>
        )}
      </div>
      <Switch
        id={id}
        checked={!!fieldValue}
        onCheckedChange={(v) => fieldOnChange(v)}
        disabled={disabled}
        ref={fieldRef}
        onBlur={fieldOnBlur}
      />
    </div>
  );
}
