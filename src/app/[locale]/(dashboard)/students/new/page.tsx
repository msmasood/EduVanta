"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StudentForm } from "@/features/students";
import { useClasses, useSections } from "@/hooks/queries/use-academic";
import { useStudentCategories } from "@/hooks/queries/use-students";
import { useGuardians } from "@/hooks/queries/use-guardians";
import type { SelectOption } from "@/types/common";

export default function AddStudentPage() {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? "en";

  const classesQuery = useClasses();
  const sectionsQuery = useSections();
  const categoriesQuery = useStudentCategories();
  const guardiansQuery = useGuardians();

  const classOptions: SelectOption[] =
    classesQuery.data?.data?.map((c) => ({
      label: c.name,
      value: c.id,
    })) ?? [];

  const sectionOptions: SelectOption[] =
    sectionsQuery.data?.data?.map((s) => ({
      label: s.name,
      value: s.id,
    })) ?? [];

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

  return (
    <DashboardLayout>
      <div className="space-y-6" data-testid="add-student-page">
        {/* Page header */}
        <div>
          <Link
            href={`/${locale}/students`}
            className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back to Students
          </Link>
          <h1 className="text-2xl font-semibold">Add New Student</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create a new student record with personal, academic, and guardian
            information.
          </p>
        </div>

        <StudentForm
          mode="create"
          classOptions={classOptions}
          sectionOptions={sectionOptions}
          categoryOptions={categoryOptions}
          guardianOptions={guardianOptions}
        />
      </div>
    </DashboardLayout>
  );
}
