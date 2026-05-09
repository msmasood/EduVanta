"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { PasswordField } from "@/components/auth/password-field";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validations/auth";

export function ResetPasswordForm() {
  const t = useTranslations("auth");
  const tv = useTranslations("validation");
  const [isPending, setIsPending] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  function getError(key: string | undefined) {
    if (!key) return undefined;
    if (key === "passwordMin") return tv("passwordMin");
    return tv(key as Parameters<typeof tv>[0]);
  }

  async function onSubmit(_data: ResetPasswordInput) {
    setIsPending(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsPending(false);
    setSubmitted(true);
    toast.success(t("reset.success"));
  }

  if (submitted) {
    return (
      <div className="space-y-4 text-center">
        <div className="flex justify-center">
          <CheckCircle className="size-16 text-teal-600" />
        </div>
        <h2 className="text-2xl font-bold">{t("reset.title")}</h2>
        <p className="text-sm text-muted-foreground">{t("reset.success")}</p>
        <Link
          href="/login"
          className={cn(buttonVariants({ variant: "default" }), "mt-4")}
        >
          {t("reset.backToLogin")}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("reset.title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("reset.subtitle")}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <PasswordField
          id="reset-password"
          label={t("common.newPassword")}
          autoComplete="new-password"
          error={errors.password ? getError(errors.password.message) : undefined}
          {...register("password")}
        />

        <PasswordField
          id="reset-confirm-password"
          label={t("common.confirmNewPassword")}
          autoComplete="new-password"
          error={
            errors.confirmPassword
              ? getError(errors.confirmPassword.message)
              : undefined
          }
          {...register("confirmPassword")}
        />

        <button
          type="submit"
          disabled={isPending}
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "w-full bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-700"
          )}
        >
          {isPending ? t("common.loading") : t("reset.submit")}
        </button>

        <div className="text-center">
          <Link
            href="/login"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← {t("reset.backToLogin")}
          </Link>
        </div>
      </form>
    </div>
  );
}
