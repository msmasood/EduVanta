"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./query-keys";
import {
  getExams,
  getExamById,
  getAllExamSchedules,
  getExamSchedules,
  getAllExamResults,
  getExamResults,
  getStudentResults,
  getGradeScales,
} from "@/services/mock/exams.service";
import type { QueryParams } from "@/types/common";

export function useExams(params?: QueryParams) {
  return useQuery({
    queryKey: queryKeys.exams.list(params),
    queryFn: () => getExams(params),
  });
}

export function useExam(id: string) {
  return useQuery({
    queryKey: queryKeys.exams.detail(id),
    queryFn: () => getExamById(id),
    enabled: !!id,
  });
}

export function useAllExamSchedules(params?: QueryParams) {
  return useQuery({
    queryKey: queryKeys.exams.allSchedules(params),
    queryFn: () => getAllExamSchedules(params),
  });
}

export function useExamSchedules(examId: string) {
  return useQuery({
    queryKey: queryKeys.exams.schedules(examId),
    queryFn: () => getExamSchedules(examId),
    enabled: !!examId,
  });
}

export function useAllExamResults(params?: QueryParams) {
  return useQuery({
    queryKey: queryKeys.exams.allResults(params),
    queryFn: () => getAllExamResults(params),
  });
}

export function useExamResults(examScheduleId?: string, studentId?: string) {
  return useQuery({
    queryKey: queryKeys.exams.results(examScheduleId, studentId),
    queryFn: () => getExamResults(examScheduleId, studentId),
  });
}

export function useStudentResults(studentId: string) {
  return useQuery({
    queryKey: queryKeys.exams.studentResults(studentId),
    queryFn: () => getStudentResults(studentId),
    enabled: !!studentId,
  });
}

export function useGradeScales() {
  return useQuery({ queryKey: queryKeys.exams.gradeScales(), queryFn: () => getGradeScales() });
}
