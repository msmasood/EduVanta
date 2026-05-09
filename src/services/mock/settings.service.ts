import type { ApiResponse } from "@/types/common";
import type {
  LanguageSetting,
  CurrencySetting,
  SubscriptionPlan,
  GeneralSettings,
  Role,
  UserRoleAssignment,
  SubscriptionUsage,
  BillingRecord,
} from "@/types/settings";
import {
  languageSettings,
  currencySettings,
  subscriptionPlans,
  generalSettings,
  roles,
  userRoles,
  subscriptionUsage,
  billingHistory,
} from "@/data/mock/settings";
import { withMockDelay } from "./delay";
import { createMockResponse } from "./helpers";

export async function getGeneralSettings(ms = 250): Promise<ApiResponse<GeneralSettings>> {
  return withMockDelay(createMockResponse(generalSettings), ms);
}

export async function getLanguageSettings(ms = 250): Promise<ApiResponse<LanguageSetting[]>> {
  return withMockDelay(createMockResponse(languageSettings), ms);
}

export async function getCurrencySettings(ms = 250): Promise<ApiResponse<CurrencySetting[]>> {
  return withMockDelay(createMockResponse(currencySettings), ms);
}

export async function getRoles(ms = 250): Promise<ApiResponse<Role[]>> {
  return withMockDelay(createMockResponse(roles), ms);
}

export async function getUserRoles(ms = 250): Promise<ApiResponse<UserRoleAssignment[]>> {
  return withMockDelay(createMockResponse(userRoles), ms);
}

export async function getSubscriptionPlans(ms = 250): Promise<ApiResponse<SubscriptionPlan[]>> {
  return withMockDelay(createMockResponse(subscriptionPlans), ms);
}

export async function getSubscriptionUsage(ms = 250): Promise<ApiResponse<SubscriptionUsage>> {
  return withMockDelay(createMockResponse(subscriptionUsage), ms);
}

export async function getBillingHistory(ms = 250): Promise<ApiResponse<BillingRecord[]>> {
  return withMockDelay(createMockResponse(billingHistory), ms);
}
