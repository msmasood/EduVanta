"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./query-keys";
import {
  getTeachers,
  getTeacherById,
  getTeacherAssignments,
  getTeacherTimetable,
  getAllTimetableEntries,
} from "@/services/mock/teachers.service";
import type { QueryParams } from "@/types/common";

export function useTeachers(params?: QueryParams) {
  return useQuery({
    queryKey: queryKeys.teachers.list(params),
    queryFn: () => getTeachers(params),
  });
}

export function useTeacher(id: string) {
  return useQuery({
    queryKey: queryKeys.teachers.detail(id),
    queryFn: () => getTeacherById(id),
    enabled: !!id,
  });
}

export function useTeacherAssignments(teacherId: string) {
  return useQuery({
    queryKey: queryKeys.teachers.assignments(teacherId),
    queryFn: () => getTeacherAssignments(teacherId),
    enabled: !!teacherId,
  });
}

export function useTeacherTimetable(teacherId: string) {
  return useQuery({
    queryKey: queryKeys.teachers.timetable(teacherId),
    queryFn: () => getTeacherTimetable(teacherId),
    enabled: !!teacherId,
  });
}

export function useAllTimetableEntries() {
  return useQuery({
    queryKey: queryKeys.teachers.allTimetable(),
    queryFn: () => getAllTimetableEntries(),
  });
}
