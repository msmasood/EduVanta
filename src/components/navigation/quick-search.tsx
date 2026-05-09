"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";

/**
 * QuickSearch — Phase 3 placeholder.
 * Full command-palette search will be implemented in a later phase.
 */
export function QuickSearch() {
  const t = useTranslations("shell");

  return (
    <button
      className="flex h-8 items-center gap-2 rounded-md border border-input bg-background px-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={t("searchPlaceholder")}
      // TODO Phase 5: open command palette
    >
      <Search className="size-3.5 shrink-0" aria-hidden="true" />
      <span className="hidden w-36 truncate sm:block">{t("searchPlaceholder")}</span>
    </button>
  );
}
