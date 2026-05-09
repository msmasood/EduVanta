import type { ApiResponse } from "@/types/common";
import type { DashboardSummary, DashboardPersona } from "@/types/dashboard";
import { dashboardSummaries } from "@/data/mock/dashboard";
import { withMockDelay } from "./delay";
import { createMockResponse, createErrorResponse } from "./helpers";

export async function getDashboardSummary(
  persona: DashboardPersona,
  _schoolId: string,
  ms = 250
): Promise<ApiResponse<DashboardSummary>> {
  const summary = dashboardSummaries[persona];
  if (!summary) {
    return withMockDelay(createErrorResponse<DashboardSummary>(`Dashboard for persona '${persona}' not found`), ms);
  }
  return withMockDelay(createMockResponse(summary), ms);
}

export async function getAllDashboardPersonas(ms = 250): Promise<ApiResponse<DashboardPersona[]>> {
  const personas = Object.keys(dashboardSummaries) as DashboardPersona[];
  return withMockDelay(createMockResponse(personas), ms);
}
