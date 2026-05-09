import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { EventsManager } from "@/features/communication";

export default function CommunicationEventsPage() {
  return (
    <DashboardLayout>
      <EventsManager />
    </DashboardLayout>
  );
}
