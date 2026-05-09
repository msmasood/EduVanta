import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StudentDashboard } from "@/features/dashboard";

export default function StudentDashboardPage() {
  return (
    <DashboardLayout>
      <StudentDashboard />
    </DashboardLayout>
  );
}
