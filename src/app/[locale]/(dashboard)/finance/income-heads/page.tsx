import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { IncomeHeadsManager } from "@/features/finance";

export default function FinanceIncomeHeadsPage() {
  return (
    <DashboardLayout>
      <IncomeHeadsManager />
    </DashboardLayout>
  );
}
