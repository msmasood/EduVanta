import type { PaginatedResponse, ApiResponse, QueryParams } from "@/types/common";
import type { Exam, ExamSchedule, ExamResult, GradeScale } from "@/types/exams";
import { exams, examSchedules, examResults, gradeScales } from "@/data/mock/exams";
import { withMockDelay } from "./delay";
import { createMockResponse, createPaginatedResponse, getById, createErrorResponse, applyQueryParams } from "./helpers";

export async function getExams(params?: QueryParams, ms = 250): Promise<PaginatedResponse<Exam>> {
  const filtered = applyQueryParams(exams, params, ["name"] as (keyof Exam)[]);
  return withMockDelay(createPaginatedResponse(filtered, params), ms);
}

export async function getExamById(id: string, ms = 250): Promise<ApiResponse<Exam>> {
  const exam = getById(exams, id);
  if (!exam) return withMockDelay(createErrorResponse<Exam>(`Exam '${id}' not found`), ms);
  return withMockDelay(createMockResponse(exam), ms);
}

export async function getAllExamSchedules(params?: QueryParams, ms = 250): Promise<PaginatedResponse<ExamSchedule>> {
  const filtered = applyQueryParams(examSchedules, params, ["date"] as (keyof ExamSchedule)[]);
  return withMockDelay(createPaginatedResponse(filtered, params), ms);
}

export async function getExamSchedules(examId: string, ms = 250): Promise<ApiResponse<ExamSchedule[]>> {
  const filtered = examSchedules.filter((s) => s.examId === examId);
  return withMockDelay(createMockResponse(filtered), ms);
}

export async function getAllExamResults(params?: QueryParams, ms = 250): Promise<PaginatedResponse<ExamResult>> {
  const filtered = applyQueryParams(examResults, params, ["grade"] as (keyof ExamResult)[]);
  return withMockDelay(createPaginatedResponse(filtered, params), ms);
}

export async function getExamResults(examScheduleId?: string, studentId?: string, ms = 250): Promise<ApiResponse<ExamResult[]>> {
  let filtered = [...examResults];
  if (examScheduleId) filtered = filtered.filter((r) => r.examScheduleId === examScheduleId);
  if (studentId) filtered = filtered.filter((r) => r.studentId === studentId);
  return withMockDelay(createMockResponse(filtered), ms);
}

export async function getStudentResults(studentId: string, ms = 250): Promise<ApiResponse<ExamResult[]>> {
  const results = examResults.filter((r) => r.studentId === studentId);
  return withMockDelay(createMockResponse(results), ms);
}

export async function getGradeScales(ms = 250): Promise<ApiResponse<GradeScale[]>> {
  return withMockDelay(createMockResponse(gradeScales), ms);
}
