"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PasswordFieldProps extends React.ComponentProps<"input"> {
  id: string;
  label: string;
  error?: string;
}

export function PasswordField({
  id,
  label,
  error,
  className,
  ...props
}: PasswordFieldProps) {
  const [visible, setVisible] = React.useState(false);
  const t = useTranslations("auth.common");

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={visible ? "text" : "password"}
          aria-invalid={!!error}
          className={cn("pe-10", className)}
          {...props}
        />
        <button
          type="button"
          aria-label={visible ? t("hidePassword") : t("showPassword")}
          onClick={() => setVisible((v) => !v)}
          className="absolute end-0 top-0 flex h-full w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none"
          tabIndex={-1}
        >
          {visible ? (
            <EyeOff className="size-4" aria-hidden />
          ) : (
            <Eye className="size-4" aria-hidden />
          )}
        </button>
      </div>
      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
