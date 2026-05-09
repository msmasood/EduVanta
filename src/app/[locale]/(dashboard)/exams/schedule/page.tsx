import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ExamScheduleManager } from "@/features/exams";

export default function ExamSchedulePage() {
  return (
    <DashboardLayout>
      <ExamScheduleManager />
    </DashboardLayout>
  );
}
