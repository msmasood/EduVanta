/**
 * Pure utility functions for DataTable infrastructure.
 * No UI imports — these are safely testable in Node/jsdom.
 */

/**
 * Generate { label, value } option objects from a flat array of status strings.
 * Capitalises the first letter and replaces hyphens with spaces in the label.
 */
export function createStatusFilterOptions(
  statuses: string[]
): { label: string; value: string }[] {
  return statuses.map((s) => ({
    label: s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, " "),
    value: s,
  }));
}

/**
 * Derive up-to-two-character initials from a name string.
 * Uses the first character of the first word and the first character of the
 * last word (if more than one word is present).
 *
 * Examples:
 *   "Ahmed Ali"  → "AA"
 *   "Single"     → "S"
 *   ""           → "?"
 */
export function getRowInitials(name: string): string {
  if (!name || !name.trim()) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (
    parts[0].charAt(0).toUpperCase() +
    parts[parts.length - 1].charAt(0).toUpperCase()
  );
}

/**
 * Normalise an arbitrary table cell value to a safe display string.
 * - null / undefined  → ""
 * - boolean           → "Yes" / "No"
 * - array / object    → JSON string (with fallback to "")
 * - everything else   → String(value)
 */
export function normalizeTableValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return "";
    }
  }
  return String(value);
}

/**
 * Read a deeply nested value from an object using a dot-separated path.
 *
 * Examples:
 *   getNestedValue({ a: { b: 1 } }, "a.b") → 1
 *   getNestedValue({ a: null }, "a.b")      → undefined
 */
export function getNestedValue(
  obj: Record<string, unknown>,
  path: string
): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc === null || acc === undefined) return undefined;
    if (typeof acc !== "object") return undefined;
    return (acc as Record<string, unknown>)[key];
  }, obj);
}
