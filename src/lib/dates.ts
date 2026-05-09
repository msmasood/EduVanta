/**
 * Date utilities — thin wrappers around Intl.DateTimeFormat.
 * date-fns is available for Phase 6+ complex date manipulation.
 */

const BCP47_MAP: Record<string, string> = {
  en: "en-US",
  ar: "ar-AE",
  ur: "ur-PK",
};

export function getDateLocaleCode(locale: string): string {
  return BCP47_MAP[locale] ?? "en-US";
}

/**
 * Format a date value as a localised date string.
 * @example formatDate(new Date(), 'ar') → "٥ مايو ٢٠٢٦"
 */
export function formatDate(value: Date | string | number, locale = "en"): string {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat(getDateLocaleCode(locale), {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

/**
 * Format a date value as a localised date + time string.
 */
export function formatDateTime(value: Date | string | number, locale = "en"): string {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat(getDateLocaleCode(locale), {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

/**
 * Format a date as a short numeric date (e.g. "05/01/2026").
 */
export function formatShortDate(value: Date | string | number, locale = "en"): string {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat(getDateLocaleCode(locale), {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/**
 * Format a date relative to now (e.g. "2 days ago", "just now").
 * Falls back to formatDate for dates older than a week.
 */
export function formatRelativeDate(value: Date | string | number, locale = "en"): string {
  const date = value instanceof Date ? value : new Date(value);
  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (typeof Intl.RelativeTimeFormat !== "undefined") {
    const rtf = new Intl.RelativeTimeFormat(getDateLocaleCode(locale), { numeric: "auto" });
    if (diffSec < 60) return rtf.format(0, "second");
    if (diffMin < 60) return rtf.format(-diffMin, "minute");
    if (diffHour < 24) return rtf.format(-diffHour, "hour");
    if (diffDay < 7) return rtf.format(-diffDay, "day");
  }
  return formatDate(date, locale);
}
