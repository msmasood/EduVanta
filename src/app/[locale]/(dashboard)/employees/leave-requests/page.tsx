import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { LeaveRequestsList } from "@/features/employees";

export default function EmployeeLeaveRequestsPage() {
  return (
    <DashboardLayout>
      <LeaveRequestsList />
    </DashboardLayout>
  );
}
