import { describe, it, expect } from "vitest";

import {
  getFieldErrorMessage,
  hasFormErrors,
  requiredLabel,
  createSelectOptions,
} from "@/lib/form";

describe("getFieldErrorMessage", () => {
  it("returns the message when error has a message", () => {
    const error = { type: "required", message: "This field is required" };
    expect(getFieldErrorMessage(error)).toBe("This field is required");
  });

  it("returns undefined for undefined error", () => {
    expect(getFieldErrorMessage(undefined)).toBeUndefined();
  });

  it("returns empty string when error has no message text", () => {
    const error = { type: "required", message: "" };
    expect(getFieldErrorMessage(error)).toBe("");
  });
});

describe("hasFormErrors", () => {
  it("returns false for empty errors object", () => {
    expect(hasFormErrors({})).toBe(false);
  });

  it("returns true when there is at least one error", () => {
    const errors = { name: { type: "required", message: "Required" } };
    expect(hasFormErrors(errors)).toBe(true);
  });

  it("returns true when errors object has keys (even if values are undefined)", () => {
    const errors = { name: undefined };
    expect(hasFormErrors(errors)).toBe(true);
  });
});

describe("requiredLabel", () => {
  it("appends space and asterisk to the label", () => {
    expect(requiredLabel("Name")).toBe("Name *");
  });

  it("works with empty string", () => {
    expect(requiredLabel("")).toBe(" *");
  });
});

describe("createSelectOptions", () => {
  it("returns the items array as-is", () => {
    const items = [
      { value: "a", label: "Alpha" },
      { value: "b", label: "Beta" },
    ];
    expect(createSelectOptions(items)).toEqual(items);
  });

  it("returns empty array for empty input", () => {
    expect(createSelectOptions([])).toEqual([]);
  });
});
