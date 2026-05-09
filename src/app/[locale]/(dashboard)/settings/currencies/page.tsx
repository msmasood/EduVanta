import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { CurrenciesManager } from "@/features/settings";

export default function SettingsCurrenciesPage() {
  return (
    <DashboardLayout>
      <CurrenciesManager />
    </DashboardLayout>
  );
}
