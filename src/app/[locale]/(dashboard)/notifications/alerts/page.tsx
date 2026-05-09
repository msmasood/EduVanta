import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { NotificationAlertsManager } from "@/features/notifications";

export default function NotificationAlertsPage() {
  return (
    <DashboardLayout>
      <NotificationAlertsManager />
    </DashboardLayout>
  );
}
