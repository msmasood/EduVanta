import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PayrollList } from "@/features/hrm";

export default function PayrollPage() {
  return (
    <DashboardLayout>
      <PayrollList />
    </DashboardLayout>
  );
}
