"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./query-keys";
import { getDashboardSummary, getAllDashboardPersonas } from "@/services/mock/dashboard.service";
import type { DashboardPersona } from "@/types/dashboard";

export function useDashboardSummary(persona: DashboardPersona, schoolId: string) {
  return useQuery({
    queryKey: queryKeys.dashboard.summary(persona, schoolId),
    queryFn: () => getDashboardSummary(persona, schoolId),
  });
}

export function useDashboardPersonas() {
  return useQuery({
    queryKey: queryKeys.dashboard.personas(),
    queryFn: () => getAllDashboardPersonas(),
  });
}
