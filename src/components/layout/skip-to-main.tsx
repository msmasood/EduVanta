"use client";

import { useTranslations } from "next-intl";

export function SkipToMain() {
  const t = useTranslations("layout");

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2"
    >
      {t("skipToMain")}
    </a>
  );
}
