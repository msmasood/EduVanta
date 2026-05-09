"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./query-keys";
import {
  getGuardians,
  getGuardianById,
  getGuardianLinks,
  getGuardianByStudentId,
} from "@/services/mock/guardians.service";
import type { QueryParams } from "@/types/common";

export function useGuardians(params?: QueryParams) {
  return useQuery({
    queryKey: queryKeys.guardians.list(params),
    queryFn: () => getGuardians(params),
  });
}

export function useGuardian(id: string) {
  return useQuery({
    queryKey: queryKeys.guardians.detail(id),
    queryFn: () => getGuardianById(id),
    enabled: !!id,
  });
}

export function useGuardianLinks(guardianId: string) {
  return useQuery({
    queryKey: queryKeys.guardians.links(guardianId),
    queryFn: () => getGuardianLinks(guardianId),
    enabled: !!guardianId,
  });
}

export function useGuardianByStudent(studentId: string) {
  return useQuery({
    queryKey: queryKeys.guardians.byStudent(studentId),
    queryFn: () => getGuardianByStudentId(studentId),
    enabled: !!studentId,
  });
}
