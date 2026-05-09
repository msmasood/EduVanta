import type { PaginatedResponse, ApiResponse, QueryParams } from "@/types/common";
import type { Guardian, GuardianStudentLink } from "@/types/guardian";
import { guardians, guardianStudentLinks } from "@/data/mock/guardians";
import { withMockDelay } from "./delay";
import { applyQueryParams, createPaginatedResponse, getById, createMockResponse, createErrorResponse } from "./helpers";

const SEARCH_FIELDS: (keyof Guardian)[] = ["firstName", "lastName"];

export async function getGuardians(params?: QueryParams, ms = 250): Promise<PaginatedResponse<Guardian>> {
  const filtered = applyQueryParams(guardians, params, SEARCH_FIELDS);
  return withMockDelay(createPaginatedResponse(filtered, params), ms);
}

export async function getGuardianById(id: string, ms = 250): Promise<ApiResponse<Guardian>> {
  const guardian = getById(guardians, id);
  if (!guardian) return withMockDelay(createErrorResponse<Guardian>(`Guardian '${id}' not found`), ms);
  return withMockDelay(createMockResponse(guardian), ms);
}

export async function getGuardianLinks(guardianId: string, ms = 250): Promise<ApiResponse<GuardianStudentLink[]>> {
  const links = guardianStudentLinks.filter((l) => l.guardianId === guardianId);
  return withMockDelay(createMockResponse(links), ms);
}

export async function getGuardianByStudentId(studentId: string, ms = 250): Promise<ApiResponse<Guardian | null>> {
  const link = guardianStudentLinks.find((l) => l.studentId === studentId && l.isPrimary);
  const guardian = link ? getById(guardians, link.guardianId) : null;
  return withMockDelay(createMockResponse(guardian), ms);
}
