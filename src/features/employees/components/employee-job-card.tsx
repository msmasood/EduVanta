"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/data-table";
import { employeeStatusToVariant, employmentTypeLabel } from "../utils/employee-mappers";
import type { Employee, Department, Designation } from "@/types/employee";

interface Props {
  employee: Employee;
  department?: Department;
  designation?: Designation;
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center">
      <span className="min-w-40 text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value || "—"}</span>
    </div>
  );
}

export function EmployeeJobCard({ employee, department, designation }: Props) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Job Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <InfoRow label="Employee Code" value={employee.employeeCode} />
        <Separator />
        <InfoRow label="Department" value={department?.name ?? "—"} />
        <Separator />
        <InfoRow label="Designation" value={designation?.name ?? "—"} />
        <Separator />
        <InfoRow label="Employment Type" value={employmentTypeLabel(employee.employmentType)} />
        <Separator />
        <InfoRow label="Joining Date" value={employee.joiningDate} />
        <Separator />
        <InfoRow
          label="Status"
          value={
            <StatusBadge
              status={employeeStatusToVariant(employee.status)}
              label={employee.status}
            />
          }
        />
      </CardContent>
    </Card>
  );
}
