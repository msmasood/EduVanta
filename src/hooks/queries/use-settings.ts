"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./query-keys";
import {
  getGeneralSettings,
  getLanguageSettings,
  getCurrencySettings,
  getRoles,
  getUserRoles,
  getSubscriptionPlans,
  getSubscriptionUsage,
  getBillingHistory,
} from "@/services/mock/settings.service";

export function useGeneralSettings() {
  return useQuery({ queryKey: queryKeys.settings.general(), queryFn: () => getGeneralSettings() });
}

export function useLanguageSettings() {
  return useQuery({ queryKey: queryKeys.settings.languages(), queryFn: () => getLanguageSettings() });
}

export function useCurrencySettings() {
  return useQuery({ queryKey: queryKeys.settings.currencies(), queryFn: () => getCurrencySettings() });
}

export function useRoles() {
  return useQuery({ queryKey: queryKeys.settings.roles(), queryFn: () => getRoles() });
}

export function useUserRoles() {
  return useQuery({ queryKey: queryKeys.settings.userRoles(), queryFn: () => getUserRoles() });
}

export function useSubscriptionPlans() {
  return useQuery({ queryKey: queryKeys.settings.plans(), queryFn: () => getSubscriptionPlans() });
}

export function useSubscriptionUsage() {
  return useQuery({ queryKey: queryKeys.settings.usage(), queryFn: () => getSubscriptionUsage() });
}

export function useBillingHistory() {
  return useQuery({ queryKey: queryKeys.settings.billing(), queryFn: () => getBillingHistory() });
}
