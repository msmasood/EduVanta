import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ClassesManager } from "@/features/academic";

export default function ClassesPage() {
  return (
    <DashboardLayout>
      <ClassesManager />
    </DashboardLayout>
  );
}
