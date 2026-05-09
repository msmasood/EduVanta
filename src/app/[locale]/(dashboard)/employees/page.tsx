import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { EmployeeList } from "@/features/employees";

export default function EmployeesPage() {
  return (
    <DashboardLayout>
      <EmployeeList />
    </DashboardLayout>
  );
}
