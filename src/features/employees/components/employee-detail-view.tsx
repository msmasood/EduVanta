"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TableSkeleton } from "@/components/data-table";
import { EmployeeProfileHeader } from "./employee-profile-header";
import { EmployeeInfoCard } from "./employee-info-card";
import { EmployeeJobCard } from "./employee-job-card";
import { EmployeeAttendanceSummary } from "./employee-attendance-summary";
import { useEmployee, useDepartments, useDesignations } from "@/hooks/queries/use-employees";
import { useEntityAttendance } from "@/hooks/queries/use-attendance";
import { countAttendanceStatuses } from "../utils/employee-mappers";
import { formatCurrency } from "@/lib/currency";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Props {
  employeeId: string;
}

export function EmployeeDetailView({ employeeId }: Props) {
  const employeeQuery = useEmployee(employeeId);
  const departmentsQuery = useDepartments();
  const designationsQuery = useDesignations();
  const attendanceQuery = useEntityAttendance(employeeId, "employee");

  const employee = employeeQuery.data?.data;
  const departments = departmentsQuery.data?.data ?? [];
  const designations = designationsQuery.data?.data ?? [];

  const department = departments.find((d) => d.id === employee?.departmentId);
  const designation = designations.find((d) => d.id === employee?.designationId);

  const attendanceCounts = React.useMemo(() => {
    const records = attendanceQuery.data?.data ?? [];
    return countAttendanceStatuses(records);
  }, [attendanceQuery.data]);

  const isLoading =
    employeeQuery.isLoading || departmentsQuery.isLoading || designationsQuery.isLoading;

  if (isLoading) {
    return (
      <div className="space-y-6" data-testid="employee-detail">
        <div className="h-20 animate-pulse rounded-xl border bg-muted" />
        <TableSkeleton columns={2} rows={6} />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="py-12 text-center" data-testid="employee-detail">
        <p className="text-muted-foreground">Employee not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="employee-detail">
      <EmployeeProfileHeader
        employee={employee}
        department={department}
        designation={designation}
      />

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="job">Job</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <EmployeeInfoCard employee={employee} />
        </TabsContent>

        <TabsContent value="job" className="mt-4">
          <EmployeeJobCard
            employee={employee}
            department={department}
            designation={designation}
          />
        </TabsContent>

        <TabsContent value="attendance" className="mt-4 space-y-4">
          <EmployeeAttendanceSummary counts={attendanceCounts} />
        </TabsContent>

        <TabsContent value="payroll" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Payroll Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center">
                <span className="min-w-40 text-sm text-muted-foreground">Basic Salary</span>
                <span className="text-sm font-medium">
                  {formatCurrency(employee.basicSalary.amount, employee.basicSalary.currency)}
                </span>
              </div>
              <Separator />
              <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center">
                <span className="min-w-40 text-sm text-muted-foreground">Currency</span>
                <span className="text-sm font-medium">{employee.basicSalary.currency}</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
