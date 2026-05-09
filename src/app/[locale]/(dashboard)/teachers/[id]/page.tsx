"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  TeacherProfileHeader,
  TeacherProfileTabs,
} from "@/features/teachers";
import { useTeacher, useTeacherAssignments } from "@/hooks/queries/use-teachers";
import { useDepartments } from "@/hooks/queries/use-employees";
import { useClasses, useSections, useSubjects } from "@/hooks/queries/use-academic";
import { useAttendanceSummary } from "@/hooks/queries/use-attendance";
import type { ClassLevel, Section, Subject } from "@/types/academic";

export default function TeacherDetailPage() {
  const params = useParams<{ locale: string; id: string }>();
  const locale = params?.locale ?? "en";
  const id = params?.id ?? "";

  const teacherQuery = useTeacher(id);
  const assignmentsQuery = useTeacherAssignments(id);
  const departmentsQuery = useDepartments();
  const subjectsQuery = useSubjects();
  const classesQuery = useClasses();
  const sectionsQuery = useSections();
  const attendanceSummaryQuery = useAttendanceSummary(id);

  const isLoading =
    teacherQuery.isLoading ||
    departmentsQuery.isLoading ||
    subjectsQuery.isLoading ||
    classesQuery.isLoading ||
    sectionsQuery.isLoading;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6" data-testid="teacher-detail-page">
          <div className="flex items-center gap-2">
            <Loader2 className="size-5 animate-spin text-muted-foreground" aria-hidden />
            <span className="text-sm text-muted-foreground">Loading teacher...</span>
          </div>
          <div className="h-32 animate-pulse rounded-xl border bg-muted" />
          <div className="h-64 animate-pulse rounded-xl border bg-muted" />
        </div>
      </DashboardLayout>
    );
  }

  const teacher = teacherQuery.data?.data;

  if (!teacher) {
    return (
      <DashboardLayout>
        <div className="space-y-4" data-testid="teacher-detail-page">
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

  const departments = departmentsQuery.data?.data ?? [];
  const department = departments.find((d) => d.id === teacher.departmentId) ?? null;
  const assignments = assignmentsQuery.data?.data ?? [];
  const classes = (classesQuery.data?.data ?? []) as ClassLevel[];
  const sections = (sectionsQuery.data?.data ?? []) as Section[];
  const subjects = (subjectsQuery.data?.data ?? []) as Subject[];
  const attendanceSummary = attendanceSummaryQuery.data?.data ?? null;

  return (
    <DashboardLayout>
      <div className="space-y-6" data-testid="teacher-detail-page">
        {/* Back link */}
        <Link
          href={`/${locale}/teachers`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to Teachers
        </Link>

        {/* Profile header */}
        <TeacherProfileHeader
          teacher={teacher}
          departmentName={department?.name}
        />

        {/* Tabs */}
        <TeacherProfileTabs
          teacher={teacher}
          assignments={assignments}
          attendanceSummary={attendanceSummary}
          department={department}
          classes={classes}
          sections={sections}
          subjects={subjects}
        />
      </div>
    </DashboardLayout>
  );
}
