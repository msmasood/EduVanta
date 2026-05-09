import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { LeaveTypesManager } from "@/features/employees";

export default function EmployeeLeaveTypesPage() {
  return (
    <DashboardLayout>
      <LeaveTypesManager />
    </DashboardLayout>
  );
}
