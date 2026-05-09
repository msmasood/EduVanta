"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StudentForm } from "@/features/students";
import { useStudent, useStudentCategories } from "@/hooks/queries/use-students";
import { useClasses, useSections } from "@/hooks/queries/use-academic";
import { useGuardians } from "@/hooks/queries/use-guardians";
import { TableSkeleton } from "@/components/data-table";
import type { SelectOption } from "@/types/common";
import type { StudentFormValues } from "@/lib/validations/students";

export default function EditStudentPage() {
  const params = useParams<{ locale: string; id: string }>();
  const locale = params?.locale ?? "en";
  const id = params?.id ?? "";

  const studentQuery = useStudent(id);
  const classesQuery = useClasses();
  const sectionsQuery = useSections();
  const categoriesQuery = useStudentCategories();
  const guardiansQuery = useGuardians();

  const student = studentQuery.data?.data;

  if (studentQuery.isLoading) {
    return (
      <DashboardLayout>
        <div data-testid="edit-student-page">
          <TableSkeleton />
        </div>
      </DashboardLayout>
    );
  }

  if (!student) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-lg font-semibold">Student not found</p>
          <Link
            href={`/${locale}/students`}
            className="mt-4 text-sm text-primary hover:underline"
          >
            Back to Students
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const classOptions: SelectOption[] =
    classesQuery.data?.data?.map((c) => ({ label: c.name, value: c.id })) ?? [];

  const sectionOptions: SelectOption[] =
    sectionsQuery.data?.data?.map((s) => ({ label: s.name, value: s.id })) ?? [];

  const categoryOptions: SelectOption[] =
    categoriesQuery.data?.data?.map((cat) => ({
      label: cat.name,
      value: cat.id,
    })) ?? [];

  const guardianOptions: SelectOption[] =
    guardiansQuery.data?.data?.map((g) => ({
      label: `${g.firstName} ${g.lastName}`,
      value: g.id,
    })) ?? [];

  // Map student fields to form default values
  const defaultValues: Partial<StudentFormValues> = {
    firstName: student.firstName,
    lastName: student.lastName,
    admissionNumber: student.admissionNumber,
    rollNumber: student.rollNumber,
    gender: student.gender,
    dateOfBirth: student.dateOfBirth ?? "",
    bloodGroup: student.bloodGroup ?? "",
    religion: student.religion ?? "",
    nationality: student.nationality ?? "",
    email: student.contact?.email ?? "",
    phone: student.contact?.phone ?? "",
    addressLine1: student.address?.line1 ?? "",
    city: student.address?.city ?? "",
    classId: student.classId,
    sectionId: student.sectionId,
    categoryId: student.categoryId ?? "",
    admissionDate: student.admissionDate,
    status: student.status,
    guardianId: student.guardianId ?? "",
  };

  return (
    <DashboardLayout>
      <div className="space-y-6" data-testid="edit-student-page">
        <div>
          <Link
            href={`/${locale}/students/${id}`}
            className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back to Student
          </Link>
          <h1 className="text-2xl font-semibold">Edit Student</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Update student information for{" "}
            <strong>
              {student.firstName} {student.lastName}
            </strong>
            .
          </p>
        </div>

        <StudentForm
          mode="edit"
          defaultValues={defaultValues}
          classOptions={classOptions}
          sectionOptions={sectionOptions}
          categoryOptions={categoryOptions}
          guardianOptions={guardianOptions}
        />
      </div>
    </DashboardLayout>
  );
}
