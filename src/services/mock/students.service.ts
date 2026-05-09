import type { PaginatedResponse, ApiResponse, QueryParams } from "@/types/common";
import type { Student, StudentCategory } from "@/types/student";
import { students, studentCategories } from "@/data/mock/students";
import { withMockDelay } from "./delay";
import { applyQueryParams, createPaginatedResponse, getById, createMockResponse, createErrorResponse } from "./helpers";

const SEARCH_FIELDS: (keyof Student)[] = ["firstName", "lastName", "admissionNumber"];

export async function getStudents(params?: QueryParams, ms = 250): Promise<PaginatedResponse<Student>> {
  const filtered = applyQueryParams(students, params, SEARCH_FIELDS);
  return withMockDelay(createPaginatedResponse(filtered, params), ms);
}

export async function getStudentById(id: string, ms = 250): Promise<ApiResponse<Student>> {
  const student = getById(students, id);
  if (!student) return withMockDelay(createErrorResponse<Student>(`Student '${id}' not found`), ms);
  return withMockDelay(createMockResponse(student), ms);
}

export async function getStudentsByClass(classId: string, sectionId?: string, ms = 250): Promise<PaginatedResponse<Student>> {
  const filtered = students.filter(
    (s) => s.classId === classId && (!sectionId || s.sectionId === sectionId)
  );
  return withMockDelay(createPaginatedResponse(filtered), ms);
}

export async function getStudentCategories(ms = 250): Promise<ApiResponse<StudentCategory[]>> {
  return withMockDelay(createMockResponse(studentCategories), ms);
}
