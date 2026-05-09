import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { FeeDiscountsManager } from "@/features/fees";

export default function FeesDiscountsPage() {
  return (
    <DashboardLayout>
      <FeeDiscountsManager />
    </DashboardLayout>
  );
}
