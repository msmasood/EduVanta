"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StudentCategoryManager } from "@/features/students";
import { useStudentCategories } from "@/hooks/queries/use-students";
import { useStudents } from "@/hooks/queries/use-students";
import { TableSkeleton } from "@/components/data-table";

export function StudentCategoriesContent() {
  const categoriesQuery = useStudentCategories();
  const studentsQuery = useStudents();

  const categories = categoriesQuery.data?.data ?? [];
  const students = studentsQuery.data?.data ?? [];

  if (categoriesQuery.isLoading || studentsQuery.isLoading) {
    return (
      <div data-testid="categories-page">
        <TableSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="categories-page">
      <div>
        <h1 className="text-2xl font-semibold">Student Categories</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage student classification categories.
        </p>
      </div>
      <StudentCategoryManager categories={categories} students={students} />
    </div>
  );
}
