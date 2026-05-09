import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { NoticesManager } from "@/features/communication";

export default function CommunicationNoticesPage() {
  return (
    <DashboardLayout>
      <NoticesManager />
    </DashboardLayout>
  );
}
