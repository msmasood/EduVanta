import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StudentAttendancePage } from "@/features/attendance";

export default function StudentAttendanceRoute() {
  return (
    <DashboardLayout>
      <StudentAttendancePage />
    </DashboardLayout>
  );
}
