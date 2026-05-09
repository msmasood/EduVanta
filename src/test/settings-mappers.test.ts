/**
 * Settings mappers unit tests — Phase 22
 */

import { describe, it, expect } from "vitest";
import {
  mapLanguagesToRows,
  mapCurrenciesToRows,
  mapRolesToRows,
  mapUserRolesToRows,
  mapBillingToRows,
  billingStatusToVariant,
  billingStatusLabel,
  planTierLabel,
  moduleLabel,
  computeSettingsSummaryStats,
} from "@/features/settings/utils/settings-mappers";
import type { LanguageSetting, CurrencySetting, Role, UserRoleAssignment, BillingRecord } from "@/types/settings";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const MOCK_LANGUAGES: LanguageSetting[] = [
  { locale: "en", name: "English", nativeName: "English", direction: "ltr", isDefault: true, isEnabled: true },
  { locale: "ar", name: "Arabic", nativeName: "العربية", direction: "rtl", isDefault: false, isEnabled: true },
  { locale: "ur", name: "Urdu", nativeName: "اردو", direction: "rtl", isDefault: false, isEnabled: false },
];

const MOCK_CURRENCIES: CurrencySetting[] = [
  { code: "USD", name: "US Dollar", symbol: "$", isDefault: true, isEnabled: true, exchangeRate: 1 },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ", isDefault: false, isEnabled: true, exchangeRate: 3.6725 },
];

const MOCK_AUDIT = { createdAt: "2024-01-01T00:00:00.000Z", updatedAt: "2024-01-01T00:00:00.000Z" };

const MOCK_ROLES: Role[] = [
  {
    id: "role-001",
    name: "Super Admin",
    description: "Full access",
    isSystem: true,
    isActive: true,
    permissions: [
      { module: "students", actions: ["view", "create", "edit", "delete"] },
      { module: "teachers", actions: ["view", "create"] },
    ],
    audit: MOCK_AUDIT,
  },
  {
    id: "role-002",
    name: "Librarian",
    description: "Library access",
    isSystem: false,
    isActive: true,
    permissions: [{ module: "library", actions: ["view", "create"] }],
    audit: MOCK_AUDIT,
  },
];

const MOCK_USER_ROLES: UserRoleAssignment[] = [
  {
    id: "ur-001",
    userId: "user-001",
    userName: "John Doe",
    userEmail: "john@example.com",
    entityType: "employee",
    roleId: "role-001",
    roleName: "Super Admin",
    assignedAt: "2024-01-01T00:00:00.000Z",
    isActive: true,
    audit: MOCK_AUDIT,
  },
  {
    id: "ur-002",
    userId: "user-002",
    userName: "Jane Smith",
    userEmail: "jane@example.com",
    entityType: "teacher",
    roleId: "role-002",
    roleName: "Librarian",
    assignedAt: "2024-02-01T00:00:00.000Z",
    isActive: false,
    audit: MOCK_AUDIT,
  },
];

const MOCK_BILLING: BillingRecord[] = [
  {
    id: "bill-001",
    invoiceNumber: "INV-2025-0001",
    planName: "Standard",
    amount: 1200,
    currency: "USD",
    billingCycle: "annual",
    billingDate: "2025-01-15T00:00:00.000Z",
    status: "paid",
    invoiceUrl: "https://example.com/inv/001",
  },
];

// ─── mapLanguagesToRows ───────────────────────────────────────────────────────

describe("mapLanguagesToRows", () => {
  it("maps all languages", () => {
    const rows = mapLanguagesToRows(MOCK_LANGUAGES);
    expect(rows).toHaveLength(3);
  });

  it("preserves locale and direction", () => {
    const rows = mapLanguagesToRows(MOCK_LANGUAGES);
    expect(rows[0].locale).toBe("en");
    expect(rows[0].direction).toBe("ltr");
    expect(rows[1].direction).toBe("rtl");
  });

  it("preserves isDefault and isEnabled flags", () => {
    const rows = mapLanguagesToRows(MOCK_LANGUAGES);
    expect(rows[0].isDefault).toBe(true);
    expect(rows[2].isEnabled).toBe(false);
  });
});

// ─── mapCurrenciesToRows ──────────────────────────────────────────────────────

describe("mapCurrenciesToRows", () => {
  it("maps all currencies", () => {
    const rows = mapCurrenciesToRows(MOCK_CURRENCIES);
    expect(rows).toHaveLength(2);
  });

  it("USD base shows special formatted rate", () => {
    const rows = mapCurrenciesToRows(MOCK_CURRENCIES);
    expect(rows[0].formattedRate).toBe("1.0000 (Base)");
  });

  it("non-USD shows 4 decimal formatted rate", () => {
    const rows = mapCurrenciesToRows(MOCK_CURRENCIES);
    expect(rows[1].formattedRate).toBe("3.6725");
  });
});

// ─── mapRolesToRows ───────────────────────────────────────────────────────────

describe("mapRolesToRows", () => {
  it("maps all roles", () => {
    const rows = mapRolesToRows(MOCK_ROLES);
    expect(rows).toHaveLength(2);
  });

  it("computes permissionCount correctly", () => {
    const rows = mapRolesToRows(MOCK_ROLES);
    // Super Admin: 4 (students) + 2 (teachers) = 6
    expect(rows[0].permissionCount).toBe(6);
    // Librarian: 2 (library)
    expect(rows[1].permissionCount).toBe(2);
  });

  it("computes moduleCount correctly", () => {
    const rows = mapRolesToRows(MOCK_ROLES);
    expect(rows[0].moduleCount).toBe(2);
    expect(rows[1].moduleCount).toBe(1);
  });

  it("preserves isSystem flag", () => {
    const rows = mapRolesToRows(MOCK_ROLES);
    expect(rows[0].isSystem).toBe(true);
    expect(rows[1].isSystem).toBe(false);
  });
});

// ─── mapUserRolesToRows ───────────────────────────────────────────────────────

describe("mapUserRolesToRows", () => {
  it("maps all user roles", () => {
    const rows = mapUserRolesToRows(MOCK_USER_ROLES);
    expect(rows).toHaveLength(2);
  });

  it("preserves userName and roleName", () => {
    const rows = mapUserRolesToRows(MOCK_USER_ROLES);
    expect(rows[0].userName).toBe("John Doe");
    expect(rows[0].roleName).toBe("Super Admin");
  });

  it("preserves isActive flag", () => {
    const rows = mapUserRolesToRows(MOCK_USER_ROLES);
    expect(rows[0].isActive).toBe(true);
    expect(rows[1].isActive).toBe(false);
  });
});

// ─── mapBillingToRows ─────────────────────────────────────────────────────────

describe("mapBillingToRows", () => {
  it("maps billing records", () => {
    const rows = mapBillingToRows(MOCK_BILLING);
    expect(rows).toHaveLength(1);
  });

  it("formats billing cycle", () => {
    const rows = mapBillingToRows(MOCK_BILLING);
    expect(rows[0].billingCycle).toBe("Annual");
  });

  it("includes formatted date", () => {
    const rows = mapBillingToRows(MOCK_BILLING);
    expect(rows[0].formattedDate).toBeTruthy();
    expect(rows[0].formattedDate.length).toBeGreaterThan(0);
  });

  it("preserves invoice number", () => {
    const rows = mapBillingToRows(MOCK_BILLING);
    expect(rows[0].invoiceNumber).toBe("INV-2025-0001");
  });
});

// ─── billingStatusToVariant ───────────────────────────────────────────────────

describe("billingStatusToVariant", () => {
  it("paid → active", () => expect(billingStatusToVariant("paid")).toBe("active"));
  it("pending → pending", () => expect(billingStatusToVariant("pending")).toBe("pending"));
  it("failed → destructive", () => expect(billingStatusToVariant("failed")).toBe("destructive"));
  it("refunded → neutral", () => expect(billingStatusToVariant("refunded")).toBe("neutral"));
});

// ─── billingStatusLabel ───────────────────────────────────────────────────────

describe("billingStatusLabel", () => {
  it("paid → Paid", () => expect(billingStatusLabel("paid")).toBe("Paid"));
  it("pending → Pending", () => expect(billingStatusLabel("pending")).toBe("Pending"));
  it("failed → Failed", () => expect(billingStatusLabel("failed")).toBe("Failed"));
  it("refunded → Refunded", () => expect(billingStatusLabel("refunded")).toBe("Refunded"));
});

// ─── planTierLabel ────────────────────────────────────────────────────────────

describe("planTierLabel", () => {
  it("standard → Standard", () => expect(planTierLabel("standard")).toBe("Standard"));
  it("enterprise → Enterprise", () => expect(planTierLabel("enterprise")).toBe("Enterprise"));
});

// ─── moduleLabel ──────────────────────────────────────────────────────────────

describe("moduleLabel", () => {
  it("students → Students", () => expect(moduleLabel("students")).toBe("Students"));
  it("certificates → Certificates", () => expect(moduleLabel("certificates")).toBe("Certificates"));
});

// ─── computeSettingsSummaryStats ──────────────────────────────────────────────

describe("computeSettingsSummaryStats", () => {
  it("computes counts correctly", () => {
    const stats = computeSettingsSummaryStats(MOCK_LANGUAGES, MOCK_CURRENCIES, MOCK_ROLES, MOCK_USER_ROLES);
    expect(stats.totalLanguages).toBe(3);
    expect(stats.enabledLanguages).toBe(2);
    expect(stats.totalCurrencies).toBe(2);
    expect(stats.enabledCurrencies).toBe(2);
    expect(stats.totalRoles).toBe(2);
    expect(stats.activeRoles).toBe(2);
    expect(stats.totalUserAssignments).toBe(2);
    expect(stats.activeAssignments).toBe(1);
  });
});
