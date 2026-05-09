"use client";

import { useParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { EmployeeDetailView } from "@/features/employees";

export default function EmployeeDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";

  return (
    <DashboardLayout>
      <EmployeeDetailView employeeId={id} />
    </DashboardLayout>
  );
}
