"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Pencil, ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/data-table";
import { employeeStatusToVariant } from "../utils/employee-mappers";
import type { Employee } from "@/types/employee";
import type { Department, Designation } from "@/types/employee";

interface Props {
  employee: Employee;
  department?: Department;
  designation?: Designation;
}

function getInitials(first: string, last: string) {
  return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();
}

export function EmployeeProfileHeader({ employee, department, designation }: Props) {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? "en";

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      {/* Back link + profile */}
      <div className="flex items-start gap-4">
        <Link
          href={`/${locale}/employees`}
          className="mt-1 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Employees
        </Link>
      </div>
      <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center">
        <Avatar className="size-16 shrink-0 border">
          <AvatarImage src={employee.profileImageUrl} alt={`${employee.firstName} ${employee.lastName}`} />
          <AvatarFallback className="text-lg font-semibold">
            {getInitials(employee.firstName, employee.lastName)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold">
              {employee.firstName} {employee.lastName}
            </h1>
            <StatusBadge status={employeeStatusToVariant(employee.status)} label={employee.status} />
          </div>
          <p className="text-sm text-muted-foreground">
            {employee.employeeCode} · {designation?.name ?? "—"} · {department?.name ?? "—"}
          </p>
        </div>
        <Link
          href={`/${locale}/employees/${employee.id}/edit`}
          className="inline-flex items-center gap-1.5 rounded-lg border bg-background px-3 py-1.5 text-sm font-medium hover:bg-muted transition-colors"
        >
          <Pencil className="size-4" aria-hidden />
          Edit
        </Link>
      </div>
    </div>
  );
}
