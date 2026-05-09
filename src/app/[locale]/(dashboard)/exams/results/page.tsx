import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ExamResultsManager } from "@/features/exams";

export default function ExamResultsPage() {
  return (
    <DashboardLayout>
      <ExamResultsManager />
    </DashboardLayout>
  );
}
