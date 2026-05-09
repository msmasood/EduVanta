"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Mail } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validations/auth";

export function ForgotPasswordForm() {
  const t = useTranslations("auth");
  const tv = useTranslations("validation");
  const [isPending, setIsPending] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  function getError(key: string | undefined) {
    if (!key) return undefined;
    return tv(key as Parameters<typeof tv>[0]);
  }

  async function onSubmit(_data: ForgotPasswordInput) {
    setIsPending(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsPending(false);
    setSubmitted(true);
    toast.success(t("forgot.success"));
  }

  if (submitted) {
    return (
      <div className="space-y-4 text-center">
        <div className="flex justify-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900">
            <Mail className="size-8 text-teal-600 dark:text-teal-400" />
          </div>
        </div>
        <h2 className="text-2xl font-bold">{t("forgot.title")}</h2>
        <p className="text-sm text-muted-foreground">{t("forgot.success")}</p>
        <Link
          href="/login"
          className={cn(buttonVariants({ variant: "ghost" }), "mt-2")}
        >
          ← {t("forgot.backToLogin")}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("forgot.title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("forgot.subtitle")}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="forgot-email">{t("common.email")}</Label>
          <Input
            id="forgot-email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-destructive" role="alert">
              {getError(errors.email.message)}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "w-full bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-700"
          )}
        >
          {isPending ? t("common.loading") : t("forgot.submit")}
        </button>

        <div className="text-center">
          <Link
            href="/login"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← {t("forgot.backToLogin")}
          </Link>
        </div>
      </form>
    </div>
  );
}
