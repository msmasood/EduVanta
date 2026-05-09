"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./query-keys";
import {
  getAcademicYears,
  getCurrentAcademicYear,
  getClasses,
  getSections,
  getSubjects,
  getClassrooms,
} from "@/services/mock/academic.service";

export function useAcademicYears(schoolId?: string) {
  return useQuery({
    queryKey: queryKeys.academic.years(schoolId),
    queryFn: () => getAcademicYears(schoolId),
  });
}

export function useCurrentAcademicYear(schoolId: string) {
  return useQuery({
    queryKey: queryKeys.academic.currentYear(schoolId),
    queryFn: () => getCurrentAcademicYear(schoolId),
    enabled: !!schoolId,
  });
}

export function useClasses(schoolId?: string) {
  return useQuery({
    queryKey: queryKeys.academic.classes(schoolId),
    queryFn: () => getClasses(schoolId),
  });
}

export function useSections(classId?: string) {
  return useQuery({
    queryKey: queryKeys.academic.sections(classId),
    queryFn: () => getSections(classId),
  });
}

export function useSubjects(classId?: string) {
  return useQuery({
    queryKey: queryKeys.academic.subjects(classId),
    queryFn: () => getSubjects(classId),
  });
}

export function useClassrooms(schoolId?: string) {
  return useQuery({
    queryKey: queryKeys.academic.classrooms(schoolId),
    queryFn: () => getClassrooms(schoolId),
  });
}
