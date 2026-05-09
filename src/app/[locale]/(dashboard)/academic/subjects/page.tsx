import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SubjectsManager } from "@/features/academic";

export default function SubjectsPage() {
  return (
    <DashboardLayout>
      <SubjectsManager />
    </DashboardLayout>
  );
}
