/**
 * React Hook Form utility helpers.
 * Pure functions — no UI imports, fully testable in Node/jsdom.
 */

import type { FieldError, FieldErrors } from "react-hook-form";

/**
 * Returns the error message string from a FieldError object, or undefined
 * when no error is present. Useful for passing to aria-describedby / role="alert".
 */
export function getFieldErrorMessage(
  error: FieldError | undefined
): string | undefined {
  return error?.message;
}

/**
 * Returns true when the FieldErrors object contains at least one entry.
 * Use this to decide whether to render a FormErrorSummary.
 */
export function hasFormErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

/**
 * Appends a visible required indicator (*) to a label string.
 * The caller is responsible for providing accessible sr-only text where needed.
 */
export function requiredLabel(label: string): string {
  return `${label} *`;
}

/**
 * Pass-through identity helper that ensures items have the right shape for
 * shadcn Select options. Useful when building options from typed arrays.
 */
export function createSelectOptions<T extends { value: string; label: string }>(
  items: T[]
): T[] {
  return items;
}
