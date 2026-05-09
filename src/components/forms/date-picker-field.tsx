"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import {
  type Control,
  type FieldPath,
  type FieldValues,
  useController,
} from "react-hook-form";

import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerFieldProps<T extends FieldValues = FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * DatePickerField<T> — RHF-integrated date picker using Calendar + Popover.
 * Stores a Date | undefined in the RHF field value.
 */
export function DatePickerField<T extends FieldValues = FieldValues>({
  control,
  name,
  label,
  placeholder = "Pick a date",
  description,
  required = false,
  disabled = false,
  className,
}: DatePickerFieldProps<T>) {
  const id = React.useId();
  const [open, setOpen] = React.useState(false);
  const { field, fieldState } = useController({ name, control });
  const errorMessage = fieldState.error?.message;
  const fieldOnChange = field.onChange;
  const fieldOnBlur = field.onBlur;
  const fieldRef = field.ref;

  const rawValue = field.value as Date | string | null | undefined;
  const selectedDate: Date | undefined =
    rawValue instanceof Date
      ? rawValue
      : rawValue
      ? new Date(rawValue as string)
      : undefined;

  const formatted = selectedDate
    ? selectedDate.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <div className={cn("space-y-1.5", className)} data-slot="date-picker-field">
      <Label htmlFor={id}>
        {label}
        {required && (
          <span className="text-destructive ms-0.5" aria-hidden>
            *
          </span>
        )}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          id={id}
          disabled={disabled}
          aria-invalid={!!errorMessage}
          aria-describedby={
            errorMessage
              ? `${id}-error`
              : description
              ? `${id}-desc`
              : undefined
          }
          className={cn(
            "inline-flex h-8 w-full items-center justify-start gap-2 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm",
            "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            !formatted && "text-muted-foreground"
          )}
          onBlur={fieldOnBlur}
          ref={fieldRef}
        >
          <CalendarIcon className="size-4 shrink-0" aria-hidden />
          {formatted ?? placeholder}
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              fieldOnChange(date ?? null);
              setOpen(false);
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
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
