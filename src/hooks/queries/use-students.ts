"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./query-keys";
import {
  getStudents,
  getStudentById,
  getStudentsByClass,
  getStudentCategories,
} from "@/services/mock/students.service";
import type { QueryParams } from "@/types/common";

export function useStudents(params?: QueryParams) {
  return useQuery({
    queryKey: queryKeys.students.list(params),
    queryFn: () => getStudents(params),
  });
}

export function useStudent(id: string) {
  return useQuery({
    queryKey: queryKeys.students.detail(id),
    queryFn: () => getStudentById(id),
    enabled: !!id,
  });
}

export function useStudentsByClass(classId: string, sectionId?: string) {
  return useQuery({
    queryKey: queryKeys.students.byClass(classId, sectionId),
    queryFn: () => getStudentsByClass(classId, sectionId),
    enabled: !!classId,
  });
}

export function useStudentCategories() {
  return useQuery({
    queryKey: queryKeys.students.categories(),
    queryFn: () => getStudentCategories(),
  });
}
