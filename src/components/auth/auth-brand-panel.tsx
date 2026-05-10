"use client";

import Image from "next/image";
import { CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";

import { APP_NAME } from "@/lib/constants";

export function AuthBrandPanel() {
  const t = useTranslations("auth.brand");

  return (
    <div
      className="relative hidden h-full flex-col justify-between overflow-hidden bg-gradient-to-br from-teal-600 to-teal-800 p-10 text-white lg:flex dark:from-teal-700 dark:to-teal-900"
      aria-hidden="true"
    >
      {/* Decorative circles */}
      <div className="absolute -top-20 -end-20 size-72 rounded-full bg-teal-500/20" />
      <div className="absolute -bottom-20 -start-20 size-96 rounded-full bg-teal-500/15" />
      <div className="absolute top-1/2 end-10 size-40 -translate-y-1/2 rounded-full bg-teal-400/10" />

      {/* Logo + brand name */}
      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <Image
            src="/brand/eduvanta-logo-square.svg"
            alt={APP_NAME}
            width={44}
            height={44}
            className="size-11 object-contain"
          />
        </div>
      </div>

      {/* Headline + benefits */}
      <div className="relative z-10 space-y-6">
        <div>
          <h2 className="text-3xl font-bold leading-tight">{t("title")}</h2>
          <p className="mt-2 text-teal-100/80 text-sm">{t("subtitle")}</p>
        </div>

        <ul className="space-y-3">
          {([0, 1, 2] as const).map((i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <CheckCircle className="mt-0.5 size-4 shrink-0 text-teal-300" />
              <span className="text-teal-100">{t(`benefits.${i}`)}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Decorative dashboard preview hint */}
      <div className="relative z-10">
        <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
          <div className="mb-3 flex items-center gap-2">
            <div className="size-2 rounded-full bg-teal-300" />
            <div className="size-2 rounded-full bg-teal-400/60" />
            <div className="size-2 rounded-full bg-teal-400/40" />
          </div>
          <div className="space-y-2">
            <div className="h-2 w-3/4 rounded-full bg-white/20" />
            <div className="h-2 w-1/2 rounded-full bg-white/15" />
            <div className="h-2 w-5/6 rounded-full bg-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
}
