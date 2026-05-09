import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { RolesManager } from "@/features/settings";

export default function SettingsRolesPage() {
  return (
    <DashboardLayout>
      <RolesManager />
    </DashboardLayout>
  );
}
