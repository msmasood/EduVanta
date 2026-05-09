import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StudentList } from "@/features/students";

export default function StudentsPage() {
  return (
    <DashboardLayout>
      <StudentList />
    </DashboardLayout>
  );
}
