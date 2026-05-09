import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { LanguagesManager } from "@/features/settings";

export default function SettingsLanguagesPage() {
  return (
    <DashboardLayout>
      <LanguagesManager />
    </DashboardLayout>
  );
}
