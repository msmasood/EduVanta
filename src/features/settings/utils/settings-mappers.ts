import type {
  LanguageSetting,
  CurrencySetting,
  Role,
  UserRoleAssignment,
  BillingRecord,
  BillingStatus,
  PlanTier,
  PermissionModule,
} from "@/types/settings";
import type { StatusVariant } from "@/components/data-table";

// ─── Row types ────────────────────────────────────────────────────────────────

export interface LanguageRow {
  locale: string;
  name: string;
  nativeName: string;
  direction: "ltr" | "rtl";
  isDefault: boolean;
  isEnabled: boolean;
}

export interface CurrencyRow {
  code: string;
  name: string;
  symbol: string;
  isDefault: boolean;
  isEnabled: boolean;
  exchangeRate: number;
  formattedRate: string;
}

export interface RoleRow {
  id: string;
  name: string;
  description: string;
  isSystem: boolean;
  isActive: boolean;
  permissionCount: number;
  moduleCount: number;
  createdAt: string;
}

export interface UserRoleRow {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  entityType: string;
  roleId: string;
  roleName: string;
  assignedAt: string;
  isActive: boolean;
}

export interface BillingRow {
  id: string;
  invoiceNumber: string;
  planName: string;
  amount: number;
  currency: string;
  billingCycle: string;
  billingDate: string;
  status: BillingStatus;
  invoiceUrl: string;
  formattedDate: string;
}

// ─── Status variant helpers ───────────────────────────────────────────────────

export function billingStatusToVariant(status: BillingStatus): StatusVariant {
  switch (status) {
    case "paid":
      return "active";
    case "pending":
      return "pending";
    case "failed":
      return "destructive";
    case "refunded":
      return "neutral";
    default:
      return "neutral";
  }
}

export function billingStatusLabel(status: BillingStatus): string {
  switch (status) {
    case "paid":
      return "Paid";
    case "pending":
      return "Pending";
    case "failed":
      return "Failed";
    case "refunded":
      return "Refunded";
    default:
      return status;
  }
}

export function planTierLabel(tier: PlanTier): string {
  const labels: Record<PlanTier, string> = {
    free: "Free",
    basic: "Basic",
    standard: "Standard",
    premium: "Premium",
    enterprise: "Enterprise",
  };
  return labels[tier] ?? tier;
}

export function moduleLabel(module: PermissionModule): string {
  const labels: Record<PermissionModule, string> = {
    students: "Students",
    teachers: "Teachers",
    guardians: "Guardians",
    employees: "Employees",
    academic: "Academic",
    exams: "Exams",
    fees: "Fees",
    finance: "Finance",
    library: "Library",
    communication: "Communication",
    notifications: "Notifications",
    certificates: "Certificates",
    settings: "Settings",
    hrm: "HRM",
    attendance: "Attendance",
    reports: "Reports",
  };
  return labels[module] ?? module;
}

// ─── Mappers ──────────────────────────────────────────────────────────────────

export function mapLanguagesToRows(languages: LanguageSetting[]): LanguageRow[] {
  return languages.map((lang) => ({
    locale: lang.locale,
    name: lang.name,
    nativeName: lang.nativeName,
    direction: lang.direction,
    isDefault: lang.isDefault,
    isEnabled: lang.isEnabled,
  }));
}

export function mapCurrenciesToRows(currencies: CurrencySetting[]): CurrencyRow[] {
  return currencies.map((c) => ({
    code: c.code,
    name: c.name,
    symbol: c.symbol,
    isDefault: c.isDefault,
    isEnabled: c.isEnabled,
    exchangeRate: c.exchangeRate,
    formattedRate: c.code === "USD" ? "1.0000 (Base)" : c.exchangeRate.toFixed(4),
  }));
}

export function mapRolesToRows(roles: Role[]): RoleRow[] {
  return roles.map((role) => ({
    id: role.id,
    name: role.name,
    description: role.description,
    isSystem: role.isSystem,
    isActive: role.isActive,
    permissionCount: role.permissions.reduce((acc, p) => acc + p.actions.length, 0),
    moduleCount: role.permissions.length,
    createdAt: role.audit.createdAt,
  }));
}

export function mapUserRolesToRows(userRoles: UserRoleAssignment[]): UserRoleRow[] {
  return userRoles.map((ur) => ({
    id: ur.id,
    userId: ur.userId,
    userName: ur.userName,
    userEmail: ur.userEmail,
    entityType: ur.entityType,
    roleId: ur.roleId,
    roleName: ur.roleName,
    assignedAt: ur.assignedAt,
    isActive: ur.isActive,
  }));
}

export function mapBillingToRows(billing: BillingRecord[]): BillingRow[] {
  return billing.map((b) => ({
    id: b.id,
    invoiceNumber: b.invoiceNumber,
    planName: b.planName,
    amount: b.amount,
    currency: b.currency,
    billingCycle: b.billingCycle === "annual" ? "Annual" : "Monthly",
    billingDate: b.billingDate,
    status: b.status,
    invoiceUrl: b.invoiceUrl,
    formattedDate: new Date(b.billingDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
  }));
}

// ─── Summary stats ────────────────────────────────────────────────────────────

export interface SettingsSummaryStats {
  totalLanguages: number;
  enabledLanguages: number;
  totalCurrencies: number;
  enabledCurrencies: number;
  totalRoles: number;
  activeRoles: number;
  totalUserAssignments: number;
  activeAssignments: number;
}

export function computeSettingsSummaryStats(
  languages: LanguageSetting[],
  currencies: CurrencySetting[],
  roles: Role[],
  userRoles: UserRoleAssignment[],
): SettingsSummaryStats {
  return {
    totalLanguages: languages.length,
    enabledLanguages: languages.filter((l) => l.isEnabled).length,
    totalCurrencies: currencies.length,
    enabledCurrencies: currencies.filter((c) => c.isEnabled).length,
    totalRoles: roles.length,
    activeRoles: roles.filter((r) => r.isActive).length,
    totalUserAssignments: userRoles.length,
    activeAssignments: userRoles.filter((ur) => ur.isActive).length,
  };
}
