import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { CertificatesManager } from "@/features/certificates";

export default function CertificatesPage() {
  return (
    <DashboardLayout>
      <CertificatesManager />
    </DashboardLayout>
  );
}
