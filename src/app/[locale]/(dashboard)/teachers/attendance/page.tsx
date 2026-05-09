import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { TeacherAttendancePage } from "@/features/attendance";

export default function TeacherAttendanceRoute() {
  return (
    <DashboardLayout>
      <TeacherAttendancePage />
    </DashboardLayout>
  );
}
