import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { TransactionsManager } from "@/features/finance";

export default function FinanceTransactionsPage() {
  return (
    <DashboardLayout>
      <TransactionsManager />
    </DashboardLayout>
  );
}
