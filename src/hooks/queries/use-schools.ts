"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./query-keys";
import {
  getSchools,
  getSchoolById,
  getSchoolProfile,
  getSchoolSettings,
} from "@/services/mock/schools.service";

export function useSchools() {
  return useQuery({
    queryKey: queryKeys.schools.list(),
    queryFn: () => getSchools(),
  });
}

export function useSchool(id: string) {
  return useQuery({
    queryKey: queryKeys.schools.detail(id),
    queryFn: () => getSchoolById(id),
    enabled: !!id,
  });
}

export function useSchoolProfile(id: string) {
  return useQuery({
    queryKey: queryKeys.schools.profile(id),
    queryFn: () => getSchoolProfile(id),
    enabled: !!id,
  });
}

export function useSchoolSettings(schoolId: string) {
  return useQuery({
    queryKey: queryKeys.schools.settings(schoolId),
    queryFn: () => getSchoolSettings(schoolId),
    enabled: !!schoolId,
  });
}
