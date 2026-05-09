"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { TeacherForm } from "@/features/teachers";
import { useTeacher } from "@/hooks/queries/use-teachers";
import { useDepartments } from "@/hooks/queries/use-employees";
import { useSubjects } from "@/hooks/queries/use-academic";
import type { SelectOption } from "@/types/common";
import type { TeacherFormValues } from "@/lib/validations/teachers";

export default function EditTeacherPage() {
  const params = useParams<{ locale: string; id: string }>();
  const locale = params?.locale ?? "en";
  const id = params?.id ?? "";

  const teacherQuery = useTeacher(id);
  const departmentsQuery = useDepartments();
  const subjectsQuery = useSubjects();

  const isLoading =
    teacherQuery.isLoading ||
    departmentsQuery.isLoading ||
    subjectsQuery.isLoading;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6" data-testid="edit-teacher-page">
          <div className="flex items-center gap-2">
            <Loader2 className="size-5 animate-spin text-muted-foreground" aria-hidden />
            <span className="text-sm text-muted-foreground">Loading teacher...</span>
          </div>
          <div className="h-64 animate-pulse rounded-xl border bg-muted" />
        </div>
      </DashboardLayout>
    );
  }

  const teacher = teacherQuery.data?.data;

  if (!teacher) {
    return (
      <DashboardLayout>
        <div className="space-y-4" data-testid="edit-teacher-page">
          <p className="text-sm text-muted-foreground">Teacher not found.</p>
          <Link
            href={`/${locale}/teachers`}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back to Teachers
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const departmentOptions: SelectOption[] =
    departmentsQuery.data?.data?.map((d) => ({
      label: d.name,
      value: d.id,
    })) ?? [];

  const subjectOptions: SelectOption[] =
    subjectsQuery.data?.data?.map((s) => ({
      label: s.name,
      value: s.id,
    })) ?? [];

  // Map Teacher type → form values (note different field names)
  const defaultValues: Partial<TeacherFormValues> = {
    firstName: teacher.firstName,
    lastName: teacher.lastName,
    teacherCode: teacher.employeeCode,
    gender: teacher.gender,
    dateOfBirth: teacher.dateOfBirth,
    departmentId: teacher.departmentId,
    designation: teacher.designation,
    qualification: teacher.qualification,
    experienceYears: teacher.experience,
    joiningDate: teacher.joiningDate,
    employmentStatus: teacher.status,
    subjectsAssigned: teacher.subjects,
    email: teacher.contact.email,
    phone: teacher.contact.phone,
    alternatePhone: teacher.contact.alternatePhone ?? "",
    addressLine1: teacher.address.line1,
    city: teacher.address.city,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6" data-testid="edit-teacher-page">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <Link
            href={`/${locale}/teachers/${id}`}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back to {teacher.firstName} {teacher.lastName}
          </Link>
          <h1 className="text-2xl font-semibold">Edit Teacher</h1>
          <p className="text-sm text-muted-foreground">
            Update teacher information for {teacher.firstName} {teacher.lastName}.
          </p>
        </div>

        {/* Form */}
        <TeacherForm
          mode="edit"
          defaultValues={defaultValues}
          departmentOptions={departmentOptions}
          subjectOptions={subjectOptions}
        />
      </div>
    </DashboardLayout>
  );
}
