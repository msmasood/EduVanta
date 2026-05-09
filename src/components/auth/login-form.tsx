"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller } from "react-hook-form";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { PasswordField } from "@/components/auth/password-field";
import { RoleDemoSelector } from "@/components/auth/role-demo-selector";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";

export function LoginForm() {
  const t = useTranslations("auth");
  const tv = useTranslations("validation");
  const [isPending, setIsPending] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  function getError(key: string | undefined) {
    if (!key) return undefined;
    if (key === "minLength") return tv("minLength", { min: 8 });
    return tv(key as Parameters<typeof tv>[0]);
  }

  async function onSubmit(_data: LoginInput) {
    setIsPending(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsPending(false);
    toast.success(t("login.success"));
  }

  function handleDemoSelect(email: string, password: string) {
    setValue("email", email, { shouldValidate: false });
    setValue("password", password, { shouldValidate: false });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("login.title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("login.subtitle")}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="login-email">{t("common.email")}</Label>
          <Input
            id="login-email"
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

        {/* Password */}
        <PasswordField
          id="login-password"
          label={t("common.password")}
          autoComplete="current-password"
          error={errors.password ? getError(errors.password.message) : undefined}
          {...register("password")}
        />

        {/* Remember me + forgot */}
        <div className="flex items-center justify-between">
          <Controller
            name="rememberMe"
            control={control}
            render={({ field }) => (
              <label className="flex cursor-pointer items-center gap-2 text-sm select-none">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(v) => field.onChange(v === true)}
                />
                {t("common.rememberMe")}
              </label>
            )}
          />
          <Link
            href="/forgot-password"
            className="text-xs text-teal-600 hover:underline dark:text-teal-400"
          >
            {t("common.forgotPassword")}
          </Link>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "w-full bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-700"
          )}
        >
          {isPending ? t("common.loading") : t("login.submit")}
        </button>

        {/* Register link */}
        <p className="text-center text-sm text-muted-foreground">
          {t("login.noAccount")}{" "}
          <Link
            href="/register"
            className="font-medium text-teal-600 hover:underline dark:text-teal-400"
          >
            {t("login.createAccount")}
          </Link>
        </p>
      </form>

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">{t("common.or")}</span>
        <Separator className="flex-1" />
      </div>

      {/* Demo role selector */}
      <RoleDemoSelector onSelect={handleDemoSelect} />
    </div>
  );
}
