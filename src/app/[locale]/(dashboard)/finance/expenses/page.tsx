import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ExpensesManager } from "@/features/finance";

export default function FinanceExpensesPage() {
  return (
    <DashboardLayout>
      <ExpensesManager />
    </DashboardLayout>
  );
}
