import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { MessagesLayout } from "@/features/communication";

export default function CommunicationMessagesPage() {
  return (
    <DashboardLayout>
      <MessagesLayout />
    </DashboardLayout>
  );
}
