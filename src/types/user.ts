import type { ID, ActiveStatus, Address, ContactInfo, AuditMeta, LocaleCode, Maybe } from "./common";
import type { CurrencyCode } from "@/lib/currency";
import type { SchoolRole } from "@/lib/constants";

// ─── User ─────────────────────────────────────────────────────────────────────

export type { SchoolRole };

export type UserRole = SchoolRole;

export interface Permission {
  id: ID;
  module: string;
  action: "read" | "write" | "delete" | "manage";
}

export interface RolePermission {
  role: UserRole;
  permissions: Permission[];
}

export interface User {
  id: ID;
  schoolId: ID;
  role: UserRole;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  preferredLocale: LocaleCode;
  preferredCurrency: CurrencyCode;
  status: ActiveStatus;
  lastLoginAt: Maybe<string>;
  audit: AuditMeta;
}

// ─── School ───────────────────────────────────────────────────────────────────

export type SchoolType = "school" | "college" | "university" | "lms" | "institute";

export interface School {
  id: ID;
  name: string;
  slug: string;
  type: SchoolType;
  logo?: string;
  address: Address;
  contact: ContactInfo;
  defaultLocale: LocaleCode;
  defaultCurrency: CurrencyCode;
  status: ActiveStatus;
  audit: AuditMeta;
}

export interface SchoolProfile extends School {
  totalStudents: number;
  totalTeachers: number;
  totalEmployees: number;
  activeSessions: number;
}

export interface SchoolSettings {
  schoolId: ID;
  allowSelfRegistration: boolean;
  enableSMSNotifications: boolean;
  enableEmailNotifications: boolean;
  academicYearStart: string;
  academicYearEnd: string;
  defaultTimezone: string;
  audit: AuditMeta;
}
