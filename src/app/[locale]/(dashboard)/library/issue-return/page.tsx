import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { IssueReturnManager } from "@/features/library";

export default function LibraryIssueReturnPage() {
  return (
    <DashboardLayout>
      <IssueReturnManager />
    </DashboardLayout>
  );
}
