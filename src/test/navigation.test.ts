import { describe, it, expect } from "vitest";
import { navigationGroups, allNavigationItems } from "@/lib/navigation";

describe("navigationGroups", () => {
  it("includes a dashboard group", () => {
    const dashboard = navigationGroups.find((g) => g.id === "dashboard");
    expect(dashboard).toBeDefined();
  });

  it("dashboard group has at least one item", () => {
    const dashboard = navigationGroups.find((g) => g.id === "dashboard");
    expect(dashboard?.items.length).toBeGreaterThan(0);
  });

  it("includes a students group", () => {
    const students = navigationGroups.find((g) => g.id === "students");
    expect(students).toBeDefined();
    expect(students?.items.length).toBeGreaterThan(0);
  });

  it("includes a settings group", () => {
    const settings = navigationGroups.find((g) => g.id === "settings");
    expect(settings).toBeDefined();
    expect(settings?.items.length).toBeGreaterThan(0);
  });

  it("has no duplicate group ids", () => {
    const ids = navigationGroups.map((g) => g.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it("has no duplicate item ids within any group", () => {
    for (const group of navigationGroups) {
      const ids = group.items.map((i) => i.id);
      const unique = new Set(ids);
      expect(unique.size).toBe(ids.length);
    }
  });

  it("all items have non-empty href values", () => {
    for (const group of navigationGroups) {
      for (const item of group.items) {
        expect(item.href).toBeTruthy();
        expect(item.href.startsWith("/")).toBe(true);
      }
    }
  });

  it("all items have a labelKey", () => {
    for (const group of navigationGroups) {
      for (const item of group.items) {
        expect(item.labelKey).toBeTruthy();
      }
    }
  });
});

describe("allNavigationItems", () => {
  it("is a flat list with items from all groups", () => {
    const totalFromGroups = navigationGroups.reduce(
      (sum, g) => sum + g.items.length,
      0,
    );
    expect(allNavigationItems.length).toBe(totalFromGroups);
  });

  it("contains at least one item pointing to /dashboard", () => {
    const found = allNavigationItems.find((i) => i.href === "/dashboard");
    expect(found).toBeDefined();
  });
});
