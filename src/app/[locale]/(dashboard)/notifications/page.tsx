import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { NotificationsManager } from "@/features/notifications";

export default function NotificationsPage() {
  return (
    <DashboardLayout>
      <NotificationsManager />
    </DashboardLayout>
  );
}
