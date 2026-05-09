import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { FeeCollectionManager } from "@/features/fees";

export default function FeesCollectPage() {
  return (
    <DashboardLayout>
      <FeeCollectionManager />
    </DashboardLayout>
  );
}
