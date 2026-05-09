import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AssignRolesManager } from "@/features/settings";

export default function SettingsAssignRolesPage() {
  return (
    <DashboardLayout>
      <AssignRolesManager />
    </DashboardLayout>
  );
}
