import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { FeeTypesManager } from "@/features/fees";

export default function FeesTypesPage() {
  return (
    <DashboardLayout>
      <FeeTypesManager />
    </DashboardLayout>
  );
}
