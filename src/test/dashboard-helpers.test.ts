import { describe, it, expect } from "vitest";
import {
  getChartColor,
  getTrendTone,
  formatTrendLabel,
  formatDashboardValue,
  getTrendColorClass,
  getTrendBgClass,
  type TrendTone,
} from "@/lib/dashboard";

// ─── getChartColor ────────────────────────────────────────────────────────────

describe("getChartColor", () => {
  it("returns var(--chart-1) for index 0", () => {
    expect(getChartColor(0)).toBe("var(--chart-1)");
  });

  it("returns var(--chart-5) for index 4", () => {
    expect(getChartColor(4)).toBe("var(--chart-5)");
  });

  it("wraps around at index 5 → var(--chart-1)", () => {
    expect(getChartColor(5)).toBe("var(--chart-1)");
  });

  it("wraps correctly for index 7 → var(--chart-3)", () => {
    expect(getChartColor(7)).toBe("var(--chart-3)");
  });

  it("handles large indices without throwing", () => {
    expect(() => getChartColor(100)).not.toThrow();
  });

  it("returns stable CSS variable strings", () => {
    const colors = [0, 1, 2, 3, 4].map(getChartColor);
    colors.forEach((c) => {
      expect(c).toMatch(/^var\(--chart-[1-5]\)$/);
    });
  });
});

// ─── getTrendTone ─────────────────────────────────────────────────────────────

describe("getTrendTone", () => {
  it("neutral → muted regardless of positiveIsGood", () => {
    expect(getTrendTone("neutral", true)).toBe("muted");
    expect(getTrendTone("neutral", false)).toBe("muted");
  });

  it("up + positiveIsGood=true → success", () => {
    expect(getTrendTone("up", true)).toBe("success");
  });

  it("up + positiveIsGood=false → destructive", () => {
    expect(getTrendTone("up", false)).toBe("destructive");
  });

  it("down + positiveIsGood=true → destructive", () => {
    expect(getTrendTone("down", true)).toBe("destructive");
  });

  it("down + positiveIsGood=false → success", () => {
    expect(getTrendTone("down", false)).toBe("success");
  });

  it("defaults positiveIsGood to true", () => {
    expect(getTrendTone("up")).toBe("success");
    expect(getTrendTone("down")).toBe("destructive");
  });
});

// ─── formatTrendLabel ─────────────────────────────────────────────────────────

describe("formatTrendLabel", () => {
  it("formats a positive percentage", () => {
    expect(formatTrendLabel(12.5)).toBe("12.5%");
  });

  it("shows one decimal place", () => {
    expect(formatTrendLabel(5)).toBe("5.0%");
  });

  it("takes absolute value of negative percentages", () => {
    expect(formatTrendLabel(-8.3)).toBe("8.3%");
  });

  it("handles zero", () => {
    expect(formatTrendLabel(0)).toBe("0.0%");
  });
});

// ─── formatDashboardValue ─────────────────────────────────────────────────────

describe("formatDashboardValue", () => {
  it("formats a plain number", () => {
    const result = formatDashboardValue(1234);
    expect(result).toContain("1");
    expect(result).toContain("234");
  });

  it("appends unit when provided", () => {
    expect(formatDashboardValue(85, { unit: "%" })).toContain("%");
  });

  it("compact: 1500 → 1.5K", () => {
    expect(formatDashboardValue(1500, { compact: true })).toBe("1.5K");
  });

  it("compact: 1_500_000 → 1.5M", () => {
    expect(formatDashboardValue(1_500_000, { compact: true })).toBe("1.5M");
  });

  it("compact with unit: 2000hrs → 2.0K hrs", () => {
    expect(formatDashboardValue(2000, { compact: true, unit: "hrs" })).toBe("2.0K hrs");
  });

  it("uses money when provided instead of raw value", () => {
    const result = formatDashboardValue(0, {
      money: { amount: 1000, currency: "USD" },
      locale: "en",
    });
    expect(result).toMatch(/1[,.]?000|1,000/);
  });

  it("handles string values", () => {
    expect(formatDashboardValue("N/A")).toBe("N/A");
    expect(formatDashboardValue("N/A", { unit: "pts" })).toBe("N/A pts");
  });

  it("handles zero value", () => {
    const result = formatDashboardValue(0);
    expect(result).toBeTruthy();
  });
});

// ─── getTrendColorClass / getTrendBgClass ─────────────────────────────────────

describe("getTrendColorClass", () => {
  const tones: TrendTone[] = ["success", "destructive", "warning", "muted"];

  it("returns a non-empty string for every tone", () => {
    tones.forEach((tone) => {
      expect(getTrendColorClass(tone)).toBeTruthy();
    });
  });
});

describe("getTrendBgClass", () => {
  const tones: TrendTone[] = ["success", "destructive", "warning", "muted"];

  it("returns a non-empty string for every tone", () => {
    tones.forEach((tone) => {
      expect(getTrendBgClass(tone)).toBeTruthy();
    });
  });
});
