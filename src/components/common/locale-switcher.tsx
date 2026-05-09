"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
  ur: "اردو",
};

export function LocaleSwitcher() {
  const t = useTranslations("common");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  function handleChange(newLocale: string | null) {
    if (!newLocale) return;
    router.replace(pathname, { locale: newLocale as Locale });
  }

  return (
    <Select value={locale} onValueChange={handleChange}>
      <SelectTrigger
        className="w-36"
        aria-label={t("currentLocale")}
      >
        <SelectValue placeholder={LOCALE_LABELS[locale]} />
      </SelectTrigger>
      <SelectContent>
        {routing.locales.map((l) => (
          <SelectItem key={l} value={l}>
            {LOCALE_LABELS[l]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
