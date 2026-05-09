/**
 * Breadcrumb utility for EduVanta.
 * Pure functions — no React, safe to use in both client and server contexts.
 */

export interface BreadcrumbSegment {
  /** Human-readable label derived from the path segment */
  label: string;
  /** Full href from the root (without locale prefix) */
  href: string;
  /** Whether this is the last (current page) segment */
  isCurrentPage: boolean;
}

/**
 * Convert a URL path segment to a human-readable label.
 * e.g. "student-dashboard" → "Student Dashboard"
 */
export function segmentToLabel(segment: string): string {
  if (!segment) return "";
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Generate breadcrumb segments from a pathname WITHOUT the locale prefix.
 * next-intl's usePathname() already strips the locale prefix.
 *
 * @example
 * getBreadcrumbs("/dashboard/student")
 * // → [
 * //     { label: "Dashboard", href: "/dashboard", isCurrentPage: false },
 * //     { label: "Student",   href: "/dashboard/student", isCurrentPage: true },
 * //   ]
 */
export function getBreadcrumbs(pathname: string): BreadcrumbSegment[] {
  const parts = pathname.replace(/^\//, "").split("/").filter(Boolean);

  if (parts.length === 0) return [];

  const segments: BreadcrumbSegment[] = [];
  let cumulativePath = "";

  for (let i = 0; i < parts.length; i++) {
    cumulativePath += `/${parts[i]}`;
    segments.push({
      label: segmentToLabel(parts[i]),
      href: cumulativePath,
      isCurrentPage: i === parts.length - 1,
    });
  }

  return segments;
}
