import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DepartmentsManager } from "@/features/hrm";

export default function DepartmentsPage() {
  return (
    <DashboardLayout>
      <DepartmentsManager />
    </DashboardLayout>
  );
}
