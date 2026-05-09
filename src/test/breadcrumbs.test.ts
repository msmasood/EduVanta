import { describe, it, expect } from "vitest";
import { getBreadcrumbs, segmentToLabel } from "@/lib/breadcrumbs";

describe("segmentToLabel", () => {
  it("converts a simple segment", () => {
    expect(segmentToLabel("dashboard")).toBe("Dashboard");
  });

  it("converts a hyphenated segment to title case", () => {
    expect(segmentToLabel("student-dashboard")).toBe("Student Dashboard");
  });

  it("handles single character segments", () => {
    expect(segmentToLabel("a")).toBe("A");
  });

  it("returns empty string for empty input", () => {
    expect(segmentToLabel("")).toBe("");
  });
});

describe("getBreadcrumbs", () => {
  it("returns empty array for root path", () => {
    expect(getBreadcrumbs("/")).toHaveLength(0);
  });

  it("returns empty array for empty string", () => {
    expect(getBreadcrumbs("")).toHaveLength(0);
  });

  it("returns one segment for /dashboard", () => {
    const result = getBreadcrumbs("/dashboard");
    expect(result).toHaveLength(1);
    expect(result[0].label).toBe("Dashboard");
    expect(result[0].href).toBe("/dashboard");
    expect(result[0].isCurrentPage).toBe(true);
  });

  it("returns two segments for /dashboard/student", () => {
    const result = getBreadcrumbs("/dashboard/student");
    expect(result).toHaveLength(2);
    expect(result[0].label).toBe("Dashboard");
    expect(result[0].href).toBe("/dashboard");
    expect(result[0].isCurrentPage).toBe(false);
    expect(result[1].label).toBe("Student");
    expect(result[1].href).toBe("/dashboard/student");
    expect(result[1].isCurrentPage).toBe(true);
  });

  it("marks only the last segment as current page", () => {
    const result = getBreadcrumbs("/students/new");
    expect(result[0].isCurrentPage).toBe(false);
    expect(result[1].isCurrentPage).toBe(true);
  });

  it("builds cumulative hrefs correctly for 3-level path", () => {
    const result = getBreadcrumbs("/academic/classes/new");
    expect(result[0].href).toBe("/academic");
    expect(result[1].href).toBe("/academic/classes");
    expect(result[2].href).toBe("/academic/classes/new");
  });

  it("handles path without leading slash", () => {
    const result = getBreadcrumbs("dashboard");
    expect(result).toHaveLength(1);
    expect(result[0].href).toBe("/dashboard");
  });
});
