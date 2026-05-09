"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FormActionsProps {
  /** Whether the form is currently submitting */
  isLoading?: boolean;
  /** Label for the primary submit button */
  submitLabel?: string;
  /** If true, shows the cancel button */
  showCancel?: boolean;
  /** Label for the cancel button */
  cancelLabel?: string;
  /** Called when cancel is clicked */
  onCancel?: () => void;
  /** If true, shows the reset button */
  showReset?: boolean;
  /** Label for the reset button */
  resetLabel?: string;
  /** Called when reset is clicked */
  onReset?: () => void;
  className?: string;
}

/**
 * FormActions — submit, cancel, and optional reset buttons.
 * The submit button shows a spinner when `isLoading` is true.
 */
export function FormActions({
  isLoading = false,
  submitLabel,
  showCancel = true,
  cancelLabel,
  onCancel,
  showReset = false,
  resetLabel,
  onReset,
  className,
}: FormActionsProps) {
  const t = useTranslations("forms");

  return (
    <div
      className={cn("flex flex-wrap items-center justify-end gap-2", className)}
      data-slot="form-actions"
    >
      {showReset && (
        <Button
          type="button"
          variant="ghost"
          disabled={isLoading}
          onClick={onReset}
        >
          {resetLabel ?? t("reset")}
        </Button>
      )}
      {showCancel && (
        <Button
          type="button"
          variant="outline"
          disabled={isLoading}
          onClick={onCancel}
        >
          {cancelLabel ?? t("cancel")}
        </Button>
      )}
      <Button type="submit" disabled={isLoading} className="min-w-24">
        {isLoading && (
          <Loader2 className="me-2 size-4 animate-spin" aria-hidden />
        )}
        {submitLabel ?? t("submit")}
      </Button>
    </div>
  );
}
