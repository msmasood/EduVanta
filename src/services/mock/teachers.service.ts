import type { PaginatedResponse, ApiResponse, QueryParams } from "@/types/common";
import type { Teacher, TeacherSubjectAssignment, TeacherTimetableEntry } from "@/types/teacher";
import { teachers, teacherSubjectAssignments, teacherTimetableEntries } from "@/data/mock/teachers";
import { withMockDelay } from "./delay";
import { applyQueryParams, createPaginatedResponse, getById, createMockResponse, createErrorResponse } from "./helpers";

const SEARCH_FIELDS: (keyof Teacher)[] = ["firstName", "lastName", "employeeCode"];

export async function getTeachers(params?: QueryParams, ms = 250): Promise<PaginatedResponse<Teacher>> {
  const filtered = applyQueryParams(teachers, params, SEARCH_FIELDS);
  return withMockDelay(createPaginatedResponse(filtered, params), ms);
}

export async function getTeacherById(id: string, ms = 250): Promise<ApiResponse<Teacher>> {
  const teacher = getById(teachers, id);
  if (!teacher) return withMockDelay(createErrorResponse<Teacher>(`Teacher '${id}' not found`), ms);
  return withMockDelay(createMockResponse(teacher), ms);
}

export async function getTeacherAssignments(teacherId: string, ms = 250): Promise<ApiResponse<TeacherSubjectAssignment[]>> {
  const assignments = teacherSubjectAssignments.filter((a) => a.teacherId === teacherId);
  return withMockDelay(createMockResponse(assignments), ms);
}

export async function getTeacherTimetable(teacherId: string, ms = 250): Promise<ApiResponse<TeacherTimetableEntry[]>> {
  const entries = teacherTimetableEntries.filter((e) => e.teacherId === teacherId);
  return withMockDelay(createMockResponse(entries), ms);
}

export async function getAllTimetableEntries(ms = 250): Promise<ApiResponse<TeacherTimetableEntry[]>> {
  return withMockDelay(createMockResponse(teacherTimetableEntries), ms);
}
