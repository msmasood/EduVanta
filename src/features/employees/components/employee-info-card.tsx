"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Employee } from "@/types/employee";

interface Props {
  employee: Employee;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center">
      <span className="min-w-40 text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value || "—"}</span>
    </div>
  );
}

export function EmployeeInfoCard({ employee }: Props) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <InfoRow label="Date of Birth" value={employee.dateOfBirth} />
        <Separator />
        <InfoRow
          label="Gender"
          value={employee.gender.charAt(0).toUpperCase() + employee.gender.slice(1)}
        />
        <Separator />
        <InfoRow label="Qualification" value={employee.qualification} />
        <Separator />
        <InfoRow label="Email" value={employee.contact?.email ?? "—"} />
        <Separator />
        <InfoRow label="Phone" value={employee.contact?.phone ?? "—"} />
        <Separator />
        <InfoRow
          label="Address"
          value={[employee.address?.line1, employee.address?.city, employee.address?.country]
            .filter(Boolean)
            .join(", ")}
        />
      </CardContent>
    </Card>
  );
}
