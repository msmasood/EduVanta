import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { GeneralSettingsManager } from "@/features/settings";

export default function SettingsGeneralPage() {
  return (
    <DashboardLayout>
      <GeneralSettingsManager />
    </DashboardLayout>
  );
}
