"use client";

import { AlertTriangle } from "lucide-react";
import { type FieldErrors } from "react-hook-form";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

interface FormErrorSummaryProps {
  errors: FieldErrors;
  className?: string;
}

/**
 * FormErrorSummary — renders a visually prominent list of all form-level
 * validation errors. Mount near the top or bottom of a form.
 */
export function FormErrorSummary({ errors, className }: FormErrorSummaryProps) {
  const t = useTranslations("forms");

  const messages = Object.entries(errors)
    .flatMap(([, error]) => {
      if (!error) return [];
      if (typeof error === "object" && "message" in error && error.message) {
        return [error.message as string];
      }
      return [];
    })
    .filter(Boolean);

  if (messages.length === 0) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      data-slot="form-error-summary"
      className={cn(
        "flex gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive",
        className
      )}
    >
      <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
      <div className="space-y-1">
        <p className="font-medium">{t("validationSummary")}</p>
        <ul className="list-disc space-y-0.5 ps-4">
          {messages.map((msg, i) => (
            <li key={i}>{msg}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
