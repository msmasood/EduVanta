import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ExamsManager } from "@/features/exams";

export default function ExamsPage() {
  return (
    <DashboardLayout>
      <ExamsManager />
    </DashboardLayout>
  );
}
