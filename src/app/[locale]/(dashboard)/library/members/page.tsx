import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { MembersManager } from "@/features/library";

export default function LibraryMembersPage() {
  return (
    <DashboardLayout>
      <MembersManager />
    </DashboardLayout>
  );
}
