import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { TeacherList } from "@/features/teachers";

export default function TeachersPage() {
  return (
    <DashboardLayout>
      <TeacherList />
    </DashboardLayout>
  );
}
