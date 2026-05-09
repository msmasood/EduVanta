import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SchoolDashboard } from "@/features/dashboard";

export default function SchoolDashboardPage() {
  return (
    <DashboardLayout>
      <SchoolDashboard />
    </DashboardLayout>
  );
}
