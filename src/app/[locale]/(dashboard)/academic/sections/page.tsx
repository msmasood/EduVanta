import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SectionsManager } from "@/features/academic";

export default function SectionsPage() {
  return (
    <DashboardLayout>
      <SectionsManager />
    </DashboardLayout>
  );
}
