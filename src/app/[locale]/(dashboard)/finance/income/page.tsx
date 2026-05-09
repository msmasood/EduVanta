import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { IncomeManager } from "@/features/finance";

export default function FinanceIncomePage() {
  return (
    <DashboardLayout>
      <IncomeManager />
    </DashboardLayout>
  );
}
