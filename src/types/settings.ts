import type { ID, AuditMeta, LocaleCode } from "./common";
import type { CurrencyCode } from "@/lib/currency";

// ─── Language setting ─────────────────────────────────────────────────────────

export interface LanguageSetting {
  locale: LocaleCode;
  name: string;
  nativeName: string;
  direction: "ltr" | "rtl";
  isDefault: boolean;
  isEnabled: boolean;
}

// ─── Currency setting ─────────────────────────────────────────────────────────

export interface CurrencySetting {
  code: CurrencyCode;
  name: string;
  symbol: string;
  isDefault: boolean;
  isEnabled: boolean;
  exchangeRate: number;
}

// ─── General settings ────────────────────────────────────────────────────────

export interface GeneralSettings {
  schoolName: string;
  schoolCode: string;
  schoolEmail: string;
  schoolPhone: string;
  schoolAddress: string;
  schoolWebsite: string;
  defaultLocale: LocaleCode;
  defaultCurrency: CurrencyCode;
  academicYearStart: string;
  academicYearEnd: string;
  timezone: string;
}

// ─── Role & permissions ───────────────────────────────────────────────────────

export type PermissionAction = "view" | "create" | "edit" | "delete";
export type PermissionModule =
  | "students"
  | "teachers"
  | "guardians"
  | "employees"
  | "academic"
  | "exams"
  | "fees"
  | "finance"
  | "library"
  | "communication"
  | "notifications"
  | "certificates"
  | "settings"
  | "hrm"
  | "attendance"
  | "reports";

export interface ModulePermission {
  module: PermissionModule;
  actions: PermissionAction[];
}

export interface Role {
  id: ID;
  name: string;
  description: string;
  isSystem: boolean;
  isActive: boolean;
  permissions: ModulePermission[];
  audit: AuditMeta;
}

export type UserRoleEntity = "employee" | "teacher" | "student" | "guardian";

export interface UserRoleAssignment {
  id: ID;
  userId: string;
  userName: string;
  userEmail: string;
  entityType: UserRoleEntity;
  roleId: ID;
  roleName: string;
  assignedAt: string;
  isActive: boolean;
  audit: AuditMeta;
}

// ─── Subscription ─────────────────────────────────────────────────────────────

export type PlanTier = "free" | "basic" | "standard" | "premium" | "enterprise";
export type BillingCycle = "monthly" | "annual";

export interface SubscriptionPlan {
  id: ID;
  name: string;
  tier: PlanTier;
  maxStudents: number;
  maxTeachers: number;
  maxAdmins: number;
  features: string[];
  price: { monthly: number; annual: number; currency: CurrencyCode };
  isActive: boolean;
  isPopular?: boolean;
  audit: AuditMeta;
}

export interface SubscriptionUsage {
  currentPlanId: ID;
  currentPlanName: string;
  tier: PlanTier;
  billingCycle: BillingCycle;
  renewalDate: string;
  studentsUsed: number;
  studentsMax: number;
  teachersUsed: number;
  teachersMax: number;
  adminsUsed: number;
  adminsMax: number;
  storageUsedMb: number;
  storageMaxMb: number;
}

export type BillingStatus = "paid" | "pending" | "failed" | "refunded";

export interface BillingRecord {
  id: ID;
  invoiceNumber: string;
  planName: string;
  amount: number;
  currency: CurrencyCode;
  billingCycle: BillingCycle;
  billingDate: string;
  status: BillingStatus;
  invoiceUrl: string;
}
