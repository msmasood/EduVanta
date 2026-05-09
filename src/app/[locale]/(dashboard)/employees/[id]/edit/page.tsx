"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { EmployeeForm } from "@/features/employees";
import { useDepartments, useDesignations, useEmployee } from "@/hooks/queries/use-employees";
import { TableSkeleton } from "@/components/data-table";

export default function EditEmployeePage() {
  const params = useParams<{ locale: string; id: string }>();
  const locale = params?.locale ?? "en";
  const id = params?.id ?? "";

  const employeeQuery = useEmployee(id);
  const departmentsQuery = useDepartments();
  const designationsQuery = useDesignations();

  const employee = employeeQuery.data?.data;
  const departments = departmentsQuery.data?.data ?? [];
  const designations = designationsQuery.data?.data ?? [];

  const isLoading =
    employeeQuery.isLoading || departmentsQuery.isLoading || designationsQuery.isLoading;

  return (
    <DashboardLayout>
      <div className="space-y-6" data-testid="edit-employee-page">
        <div className="flex flex-col gap-2">
          <Link
            href={`/${locale}/employees/${id}`}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back to Employee
          </Link>
          <h1 className="text-2xl font-semibold">Edit Employee</h1>
        </div>

        {isLoading ? (
          <TableSkeleton columns={2} rows={8} />
        ) : (
          <EmployeeForm
            mode="edit"
            employee={employee}
            departments={departments}
            designations={designations}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
