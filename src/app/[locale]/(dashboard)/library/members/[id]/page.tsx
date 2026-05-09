"use client";

import { useParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { MemberDetailView } from "@/features/library";

export default function LibraryMemberDetailPage() {
  const params = useParams<{ id: string }>();
  const memberId = params?.id ?? "";

  return (
    <DashboardLayout>
      <MemberDetailView memberId={memberId} />
    </DashboardLayout>
  );
}
