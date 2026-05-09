import type { ApiResponse, QueryParams } from "@/types/common";
import type { AcademicYear, ClassLevel, Section, Subject, Classroom } from "@/types/academic";
import { academicYears } from "@/data/mock/schools";
import { classLevels, sections, subjects, classrooms } from "@/data/mock/academic";
import { withMockDelay } from "./delay";
import { createMockResponse } from "./helpers";

export async function getAcademicYears(schoolId?: string, ms = 250): Promise<ApiResponse<AcademicYear[]>> {
  const filtered = schoolId ? academicYears.filter((y) => y.schoolId === schoolId) : academicYears;
  return withMockDelay(createMockResponse(filtered), ms);
}

export async function getCurrentAcademicYear(schoolId: string, ms = 250): Promise<ApiResponse<AcademicYear | null>> {
  const year = academicYears.find((y) => y.schoolId === schoolId && y.isCurrent) ?? null;
  return withMockDelay(createMockResponse(year), ms);
}

export async function getClasses(schoolId?: string, ms = 250): Promise<ApiResponse<ClassLevel[]>> {
  const filtered = schoolId ? classLevels.filter((c) => c.schoolId === schoolId) : classLevels;
  return withMockDelay(createMockResponse(filtered), ms);
}

export async function getSections(classId?: string, ms = 250): Promise<ApiResponse<Section[]>> {
  const filtered = classId ? sections.filter((s) => s.classId === classId) : sections;
  return withMockDelay(createMockResponse(filtered), ms);
}

export async function getSubjects(classId?: string, ms = 250): Promise<ApiResponse<Subject[]>> {
  const filtered = classId
    ? subjects.filter((s) => s.classIds.includes(classId))
    : subjects;
  return withMockDelay(createMockResponse(filtered), ms);
}

export async function getClassrooms(schoolId?: string, ms = 250): Promise<ApiResponse<Classroom[]>> {
  const filtered = schoolId ? classrooms.filter((r) => r.schoolId === schoolId) : classrooms;
  return withMockDelay(createMockResponse(filtered), ms);
}
