"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PasswordField } from "@/components/auth/password-field";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { CURRENCY_CODES, CURRENCIES } from "@/lib/currency";

const COUNTRIES = [
  { code: "AE", name: "United Arab Emirates" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "PK", name: "Pakistan" },
  { code: "IN", name: "India" },
  { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" },
  { code: "QA", name: "Qatar" },
  { code: "KW", name: "Kuwait" },
  { code: "OM", name: "Oman" },
  { code: "BH", name: "Bahrain" },
  { code: "EG", name: "Egypt" },
  { code: "JO", name: "Jordan" },
];

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "ar", name: "العربية" },
  { code: "ur", name: "اردو" },
];

export function RegisterForm() {
  const t = useTranslations("auth");
  const tv = useTranslations("validation");
  const [isPending, setIsPending] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      schoolName: "",
      fullName: "",
      email: "",
      phone: "",
      country: "",
      preferredLanguage: "en",
      preferredCurrency: "USD",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });

  function getError(key: string | undefined) {
    if (!key) return undefined;
    if (key === "minLength") return tv("minLength", { min: 2 });
    if (key === "passwordMin") return tv("passwordMin");
    return tv(key as Parameters<typeof tv>[0]);
  }

  async function onSubmit(_data: RegisterInput) {
    setIsPending(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsPending(false);
    setSubmitted(true);
    toast.success(t("register.successTitle"));
  }

  if (submitted) {
    return (
      <div className="space-y-4 text-center">
        <div className="flex justify-center">
          <CheckCircle className="size-16 text-teal-600" />
        </div>
        <h2 className="text-2xl font-bold">{t("register.successTitle")}</h2>
        <p className="text-sm text-muted-foreground">
          {t("register.successDescription")}
        </p>
        <Link
          href="/login"
          className={cn(buttonVariants({ variant: "default" }), "mt-4")}
        >
          {t("register.signIn")}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("register.title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("register.subtitle")}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {/* School name */}
        <div className="space-y-1.5">
          <Label htmlFor="reg-school">{t("common.schoolName")}</Label>
          <Input
            id="reg-school"
            autoComplete="organization"
            aria-invalid={!!errors.schoolName}
            {...register("schoolName")}
          />
          {errors.schoolName && (
            <p className="text-xs text-destructive" role="alert">
              {getError(errors.schoolName.message)}
            </p>
          )}
        </div>

        {/* Full name */}
        <div className="space-y-1.5">
          <Label htmlFor="reg-name">{t("common.fullName")}</Label>
          <Input
            id="reg-name"
            autoComplete="name"
            aria-invalid={!!errors.fullName}
            {...register("fullName")}
          />
          {errors.fullName && (
            <p className="text-xs text-destructive" role="alert">
              {getError(errors.fullName.message)}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="reg-email">{t("common.email")}</Label>
          <Input
            id="reg-email"
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

        {/* Phone (optional) */}
        <div className="space-y-1.5">
          <Label htmlFor="reg-phone">{t("common.phone")}</Label>
          <Input
            id="reg-phone"
            type="tel"
            autoComplete="tel"
            {...register("phone")}
          />
        </div>

        {/* Country + language in a row */}
        <div className="grid grid-cols-2 gap-3">
          {/* Country */}
          <div className="space-y-1.5">
            <Label>{t("common.country")}</Label>
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(v: string | null) => {
                    if (!v) return;
                    field.onChange(v);
                  }}
                >
                  <SelectTrigger
                    className="w-full"
                    aria-invalid={!!errors.country}
                  >
                    <SelectValue placeholder="—" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.country && (
              <p className="text-xs text-destructive" role="alert">
                {getError(errors.country.message)}
              </p>
            )}
          </div>

          {/* Language */}
          <div className="space-y-1.5">
            <Label>{t("common.preferredLanguage")}</Label>
            <Controller
              name="preferredLanguage"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(v: string | null) => {
                    if (!v) return;
                    field.onChange(v);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((l) => (
                      <SelectItem key={l.code} value={l.code}>
                        {l.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        {/* Currency */}
        <div className="space-y-1.5">
          <Label>{t("common.preferredCurrency")}</Label>
          <Controller
            name="preferredCurrency"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(v: string | null) => {
                  if (!v) return;
                  field.onChange(v);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCY_CODES.map((code) => (
                    <SelectItem key={code} value={code}>
                      {CURRENCIES[code].symbol} — {CURRENCIES[code].name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Password */}
        <PasswordField
          id="reg-password"
          label={t("common.password")}
          autoComplete="new-password"
          error={errors.password ? getError(errors.password.message) : undefined}
          {...register("password")}
        />

        {/* Confirm password */}
        <PasswordField
          id="reg-confirm-password"
          label={t("common.confirmPassword")}
          autoComplete="new-password"
          error={
            errors.confirmPassword
              ? getError(errors.confirmPassword.message)
              : undefined
          }
          {...register("confirmPassword")}
        />

        {/* Terms */}
        <Controller
          name="agreeToTerms"
          control={control}
          render={({ field }) => (
            <div className="space-y-1">
              <label className="flex cursor-pointer items-start gap-2.5 text-sm select-none">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(v) => field.onChange(v === true)}
                  aria-invalid={!!errors.agreeToTerms}
                  className="mt-0.5 shrink-0"
                />
                <span className="leading-snug">
                  {t("common.terms")}
                </span>
              </label>
              {errors.agreeToTerms && (
                <p className="text-xs text-destructive" role="alert">
                  {getError(errors.agreeToTerms.message)}
                </p>
              )}
            </div>
          )}
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "w-full bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-700"
          )}
        >
          {isPending ? t("common.loading") : t("register.submit")}
        </button>

        {/* Login link */}
        <p className="text-center text-sm text-muted-foreground">
          {t("register.haveAccount")}{" "}
          <Link
            href="/login"
            className="font-medium text-teal-600 hover:underline dark:text-teal-400"
          >
            {t("register.signIn")}
          </Link>
        </p>
      </form>
    </div>
  );
}
