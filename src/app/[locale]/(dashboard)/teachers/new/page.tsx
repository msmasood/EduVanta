"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { TeacherForm } from "@/features/teachers";
import { useDepartments } from "@/hooks/queries/use-employees";
import { useSubjects } from "@/hooks/queries/use-academic";
import type { SelectOption } from "@/types/common";

export default function NewTeacherPage() {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? "en";

  const departmentsQuery = useDepartments();
  const subjectsQuery = useSubjects();

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

  return (
    <DashboardLayout>
      <div className="space-y-6" data-testid="add-teacher-page">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <Link
            href={`/${locale}/teachers`}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back to Teachers
          </Link>
          <h1 className="text-2xl font-semibold">Add New Teacher</h1>
          <p className="text-sm text-muted-foreground">
            Create a new teacher record with personal and professional information.
          </p>
        </div>

        {/* Form */}
        <TeacherForm
          mode="create"
          departmentOptions={departmentOptions}
          subjectOptions={subjectOptions}
        />
      </div>
    </DashboardLayout>
  );
}
