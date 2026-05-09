import type { ApiResponse } from "@/types/common";
import type { School, SchoolProfile, SchoolSettings } from "@/types/user";
import { schools, schoolProfiles, schoolSettings } from "@/data/mock/schools";
import { withMockDelay } from "./delay";
import { createMockResponse, getById, createErrorResponse } from "./helpers";

export async function getSchools(ms = 250): Promise<ApiResponse<School[]>> {
  return withMockDelay(createMockResponse(schools), ms);
}

export async function getSchoolById(id: string, ms = 250): Promise<ApiResponse<School>> {
  const school = getById(schools, id);
  if (!school) return withMockDelay(createErrorResponse<School>(`School '${id}' not found`), ms);
  return withMockDelay(createMockResponse(school), ms);
}

export async function getSchoolProfile(id: string, ms = 250): Promise<ApiResponse<SchoolProfile>> {
  const profile = schoolProfiles.find((p) => p.id === id) ?? null;
  if (!profile) return withMockDelay(createErrorResponse<SchoolProfile>(`School profile '${id}' not found`), ms);
  return withMockDelay(createMockResponse(profile), ms);
}

export async function getSchoolSettings(schoolId: string, ms = 250): Promise<ApiResponse<SchoolSettings | null>> {
  const settings = schoolSettings.find((s) => s.schoolId === schoolId) ?? null;
  return withMockDelay(createMockResponse(settings), ms);
}
