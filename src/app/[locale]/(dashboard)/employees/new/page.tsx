"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { EmployeeForm } from "@/features/employees";
import { useDepartments, useDesignations } from "@/hooks/queries/use-employees";

export default function NewEmployeePage() {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? "en";

  const departmentsQuery = useDepartments();
  const designationsQuery = useDesignations();

  const departments = departmentsQuery.data?.data ?? [];
  const designations = designationsQuery.data?.data ?? [];

  return (
    <DashboardLayout>
      <div className="space-y-6" data-testid="add-employee-page">
        <div className="flex flex-col gap-2">
          <Link
            href={`/${locale}/employees`}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back to Employees
          </Link>
          <h1 className="text-2xl font-semibold">Add New Employee</h1>
          <p className="text-sm text-muted-foreground">
            Create a new employee record with personal and job information.
          </p>
        </div>
        <EmployeeForm
          mode="create"
          departments={departments}
          designations={designations}
        />
      </div>
    </DashboardLayout>
  );
}
