"use client";

import * as React from "react";
import { Paperclip, X } from "lucide-react";
import {
  type Control,
  type FieldPath,
  type FieldValues,
  useController,
} from "react-hook-form";
import { useTranslations } from "next-intl";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileUploadFieldProps<T extends FieldValues = FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  accept?: string;
  multiple?: boolean;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * FileUploadField<T> — RHF-integrated native file input.
 * Shows selected file name(s) after selection.
 * Stores a FileList (or null) in RHF state.
 */
export function FileUploadField<T extends FieldValues = FieldValues>({
  control,
  name,
  label,
  accept,
  multiple = false,
  description,
  required = false,
  disabled = false,
  className,
}: FileUploadFieldProps<T>) {
  const id = React.useId();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { field, fieldState } = useController({ name, control });
  const t = useTranslations("forms");
  const errorMessage = fieldState.error?.message;

  const files = (field.value ?? null) as FileList | null;
  const hasFiles = files != null && files.length > 0;

  const fileNames = hasFiles
    ? Array.from(files as FileList)
        .map((f) => (f as File).name)
        .join(", ")
    : null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    field.onChange(e.target.files);
  };

  const handleClear = () => {
    field.onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={cn("space-y-1.5", className)} data-slot="file-upload-field">
      <Label htmlFor={id}>
        {label}
        {required && (
          <span className="text-destructive ms-0.5" aria-hidden>
            *
          </span>
        )}
      </Label>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className="h-8 gap-1.5"
        >
          <Paperclip className="size-3.5" aria-hidden />
          {t("uploadFile")}
        </Button>
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept}
          multiple={multiple}
          className="sr-only"
          disabled={disabled}
          aria-invalid={!!errorMessage}
          aria-describedby={errorMessage ? `${id}-error` : undefined}
          onChange={handleChange}
          onBlur={field.onBlur}
        />
        {hasFiles ? (
          <div className="flex min-w-0 flex-1 items-center gap-1">
            <span className="truncate text-xs text-muted-foreground">
              {fileNames}
            </span>
            <button
              type="button"
              onClick={handleClear}
              className="ms-1 text-muted-foreground hover:text-destructive focus-visible:outline-none"
              aria-label="Remove file"
            >
              <X className="size-3.5" aria-hidden />
            </button>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">
            {t("noFileSelected")}
          </span>
        )}
      </div>
      {description && !errorMessage && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {errorMessage && (
        <p id={`${id}-error`} role="alert" className="text-xs text-destructive">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
