import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SubscriptionManager } from "@/features/settings";

export default function SettingsSubscriptionPage() {
  return (
    <DashboardLayout>
      <SubscriptionManager />
    </DashboardLayout>
  );
}
