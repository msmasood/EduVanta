"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  StudentProfileHeader,
  StudentProfileTabs,
} from "@/features/students";
import { useStudent } from "@/hooks/queries/use-students";
import { useGuardianByStudent } from "@/hooks/queries/use-guardians";
import { useClasses, useSections } from "@/hooks/queries/use-academic";
import { useStudentCategories } from "@/hooks/queries/use-students";
import { useAttendanceSummary } from "@/hooks/queries/use-attendance";
import { TableSkeleton } from "@/components/data-table";

export default function StudentDetailPage() {
  const params = useParams<{ locale: string; id: string }>();
  const locale = params?.locale ?? "en";
  const id = params?.id ?? "";

  const studentQuery = useStudent(id);
  const guardianQuery = useGuardianByStudent(id);
  const classesQuery = useClasses();
  const sectionsQuery = useSections();
  const categoriesQuery = useStudentCategories();
  const attendanceQuery = useAttendanceSummary(id);

  const student = studentQuery.data?.data;

  if (studentQuery.isLoading) {
    return (
      <DashboardLayout>
        <div data-testid="student-detail-page">
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
          <p className="mt-1 text-sm text-muted-foreground">
            The student you&apos;re looking for doesn&apos;t exist.
          </p>
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

  const guardian = guardianQuery.data?.data ?? null;
  const classes = classesQuery.data?.data ?? [];
  const sections = sectionsQuery.data?.data ?? [];
  const categories = categoriesQuery.data?.data ?? [];

  const classLevel = classes.find((c) => c.id === student.classId) ?? null;
  const section = sections.find((s) => s.id === student.sectionId) ?? null;
  const category = student.categoryId
    ? (categories.find((c) => c.id === student.categoryId) ?? null)
    : null;

  const attendanceSummary = attendanceQuery.data?.data ?? null;

  return (
    <DashboardLayout>
      <div className="space-y-6" data-testid="student-detail-page">
        <Link
          href={`/${locale}/students`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to Students
        </Link>

        <StudentProfileHeader
          student={student}
          className_={classLevel?.name}
          sectionName={section?.name}
        />

        <StudentProfileTabs
          student={student}
          guardian={guardian}
          attendanceSummary={attendanceSummary}
          classLevel={classLevel}
          section={section}
          category={category}
        />
      </div>
    </DashboardLayout>
  );
}
