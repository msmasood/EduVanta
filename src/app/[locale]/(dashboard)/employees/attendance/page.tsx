import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { EmployeeAttendancePage } from "@/features/attendance";

export default function EmployeeAttendanceRoute() {
  return (
    <DashboardLayout>
      <EmployeeAttendancePage />
    </DashboardLayout>
  );
}
