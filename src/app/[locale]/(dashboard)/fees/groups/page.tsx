import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { FeeGroupsManager } from "@/features/fees";

export default function FeesGroupsPage() {
  return (
    <DashboardLayout>
      <FeeGroupsManager />
    </DashboardLayout>
  );
}
