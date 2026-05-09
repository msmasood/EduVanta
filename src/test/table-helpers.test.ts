import { describe, it, expect } from "vitest";

import {
  escapeCsvValue,
  objectsToCsv,
} from "@/lib/export";
import {
  createStatusFilterOptions,
  getRowInitials,
  normalizeTableValue,
  getNestedValue,
} from "@/lib/table";

// ─── export.ts tests ──────────────────────────────────────────────────────────

describe("escapeCsvValue", () => {
  it("returns plain strings as-is", () => {
    expect(escapeCsvValue("hello")).toBe("hello");
  });

  it("wraps values containing commas in quotes", () => {
    expect(escapeCsvValue("hello, world")).toBe('"hello, world"');
  });

  it("wraps values containing double-quotes and escapes them", () => {
    expect(escapeCsvValue('say "hi"')).toBe('"say ""hi"""');
  });

  it("wraps values containing newlines in quotes", () => {
    expect(escapeCsvValue("line1\nline2")).toBe('"line1\nline2"');
  });

  it("returns empty string for null", () => {
    expect(escapeCsvValue(null)).toBe("");
  });

  it("returns empty string for undefined", () => {
    expect(escapeCsvValue(undefined)).toBe("");
  });

  it("converts numbers to strings", () => {
    expect(escapeCsvValue(42)).toBe("42");
  });

  it("converts booleans to strings", () => {
    expect(escapeCsvValue(true)).toBe("true");
  });
});

describe("objectsToCsv", () => {
  const columns = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "status", header: "Status" },
  ];

  const rows = [
    { name: "Ahmed", status: "active" },
    { name: "Sara, Johnson", status: "pending" },
  ];

  it("produces a header row", () => {
    const csv = objectsToCsv(rows, columns);
    expect(csv.startsWith("Name,Status\n")).toBe(true);
  });

  it("produces data rows with correct values", () => {
    const csv = objectsToCsv(rows, columns);
    expect(csv).toContain("Ahmed,active");
  });

  it("escapes commas in cell values", () => {
    const csv = objectsToCsv(rows, columns);
    expect(csv).toContain('"Sara, Johnson"');
  });

  it("returns only header row for empty data", () => {
    const csv = objectsToCsv([], columns);
    expect(csv.trim()).toBe("Name,Status");
  });
});

// ─── table.ts tests ───────────────────────────────────────────────────────────

describe("getRowInitials", () => {
  it("returns initials for two-word names", () => {
    expect(getRowInitials("Ahmed Ali")).toBe("AA");
  });

  it("returns single initial for one-word names", () => {
    expect(getRowInitials("Single")).toBe("S");
  });

  it("returns ? for empty strings", () => {
    expect(getRowInitials("")).toBe("?");
  });

  it("uppercases the initials", () => {
    expect(getRowInitials("john doe")).toBe("JD");
  });

  it("handles more than two words by using first and last", () => {
    const result = getRowInitials("John Michael Doe");
    // Should be 2 characters: first + last word first letter
    expect(result).toHaveLength(2);
    expect(result[0]).toBe("J");
  });
});

describe("createStatusFilterOptions", () => {
  it("returns options with label and value properties", () => {
    const opts = createStatusFilterOptions(["active", "pending"]);
    expect(opts).toHaveLength(2);
    expect(opts[0]).toMatchObject({ value: "active", label: expect.any(String) });
  });

  it("capitalises the label", () => {
    const opts = createStatusFilterOptions(["active"]);
    expect(opts[0].label[0]).toBe(opts[0].label[0].toUpperCase());
  });

  it("returns empty array for empty input", () => {
    expect(createStatusFilterOptions([])).toEqual([]);
  });
});

describe("normalizeTableValue", () => {
  it("returns empty string for null", () => {
    expect(normalizeTableValue(null)).toBe("");
  });

  it("returns empty string for undefined", () => {
    expect(normalizeTableValue(undefined)).toBe("");
  });

  it("returns Yes for true", () => {
    expect(normalizeTableValue(true)).toBe("Yes");
  });

  it("returns No for false", () => {
    expect(normalizeTableValue(false)).toBe("No");
  });

  it("returns string as-is", () => {
    expect(normalizeTableValue("hello")).toBe("hello");
  });

  it("converts numbers to string", () => {
    expect(normalizeTableValue(42)).toBe("42");
  });
});

describe("getNestedValue", () => {
  it("retrieves top-level key", () => {
    expect(getNestedValue({ name: "Alice" }, "name")).toBe("Alice");
  });

  it("retrieves nested key via dot notation", () => {
    const obj = { address: { city: "Dubai" } } as Record<string, unknown>;
    expect(getNestedValue(obj, "address.city")).toBe("Dubai");
  });

  it("returns undefined for missing key", () => {
    expect(getNestedValue({}, "missing")).toBeUndefined();
  });
});
