import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ExpenseHeadsManager } from "@/features/finance";

export default function FinanceExpenseHeadsPage() {
  return (
    <DashboardLayout>
      <ExpenseHeadsManager />
    </DashboardLayout>
  );
}
