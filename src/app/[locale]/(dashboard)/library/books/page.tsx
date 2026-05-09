import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { BooksManager } from "@/features/library";

export default function LibraryBooksPage() {
  return (
    <DashboardLayout>
      <BooksManager />
    </DashboardLayout>
  );
}
