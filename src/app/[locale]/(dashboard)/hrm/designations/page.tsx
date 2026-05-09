import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DesignationsManager } from "@/features/hrm";

export default function DesignationsPage() {
  return (
    <DashboardLayout>
      <DesignationsManager />
    </DashboardLayout>
  );
}
