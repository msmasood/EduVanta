import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ClassroomsManager } from "@/features/academic";

export default function ClassroomsPage() {
  return (
    <DashboardLayout>
      <ClassroomsManager />
    </DashboardLayout>
  );
}
