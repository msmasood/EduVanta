"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import {
  type Control,
  type FieldPath,
  type FieldValues,
  useController,
} from "react-hook-form";
import { useTranslations } from "next-intl";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface PasswordFieldProps<T extends FieldValues = FieldValues> {
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
 * PasswordField<T> — RHF-integrated password input with show/hide toggle.
 * Uses "forms" i18n namespace for show/hide button aria-labels.
 */
export function PasswordField<T extends FieldValues = FieldValues>({
  control,
  name,
  label,
  placeholder,
  description,
  required = false,
  disabled = false,
  className,
}: PasswordFieldProps<T>) {
  const id = React.useId();
  const [visible, setVisible] = React.useState(false);
  const { field, fieldState } = useController({ name, control });
  const t = useTranslations("forms");
  const errorMessage = fieldState.error?.message;

  return (
    <div className={cn("space-y-1.5", className)} data-slot="password-field">
      <Label htmlFor={id}>
        {label}
        {required && (
          <span className="text-destructive ms-0.5" aria-hidden>
            *
          </span>
        )}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={visible ? "text" : "password"}
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
          className="pe-10"
          {...field}
          value={field.value ?? ""}
        />
        <button
          type="button"
          aria-label={visible ? t("hidePassword") : t("showPassword")}
          onClick={() => setVisible((v) => !v)}
          tabIndex={-1}
          className="absolute end-0 top-0 flex h-full w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none"
        >
          {visible ? (
            <EyeOff className="size-4" aria-hidden />
          ) : (
            <Eye className="size-4" aria-hidden />
          )}
        </button>
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
