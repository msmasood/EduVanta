import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { TeacherDashboard } from "@/features/dashboard";

export default function TeacherDashboardPage() {
  return (
    <DashboardLayout>
      <TeacherDashboard />
    </DashboardLayout>
  );
}
