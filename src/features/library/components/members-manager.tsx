"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";

import { DataTable, TableSkeleton, ConfirmDialog } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { useLibraryMembers, useBookIssues } from "@/hooks/queries/use-library";
import { useStudents } from "@/hooks/queries/use-students";
import { useTeachers } from "@/hooks/queries/use-teachers";
import { useEmployees } from "@/hooks/queries/use-employees";
import { mapMembersToRows, type MemberRow } from "../utils/library-mappers";
import { computeMemberStats } from "../utils/library-calculations";
import { buildMemberColumns, MEMBER_FILTER_CONFIGS } from "./member-columns";
import { MemberFormDialog } from "./member-form-dialog";
import { MemberSummaryCards } from "./library-summary-cards";
import type { LibraryMemberFormValues } from "@/lib/validations/library";

export function MembersManager() {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const locale = typeof params?.locale === "string" ? params.locale : "en";

  const membersQuery = useLibraryMembers();
  const issuesQuery = useBookIssues();
  const studentsQuery = useStudents();
  const teachersQuery = useTeachers();
  const employeesQuery = useEmployees();

  const [addOpen, setAddOpen] = React.useState(false);
  const [editMember, setEditMember] = React.useState<MemberRow | undefined>();
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const membersRaw = membersQuery.data?.data ?? [];
  const issuesRaw = issuesQuery.data?.data ?? [];
  const students = studentsQuery.data?.data ?? [];
  const teachers = teachersQuery.data?.data ?? [];
  const employees = employeesQuery.data?.data ?? [];

  const rows = React.useMemo(
    () => mapMembersToRows(membersRaw, issuesRaw, students, teachers, employees, locale),
    [membersRaw, issuesRaw, students, teachers, employees, locale]
  );

  const stats = React.useMemo(() => computeMemberStats(membersRaw), [membersRaw]);

  const handleView = (row: MemberRow) => {
    router.push(`/${locale}/library/members/${row.id}`);
  };

  const handleEdit = (row: MemberRow) => {
    setEditMember(row);
    setEditOpen(true);
  };

  const handleSave = (_values: LibraryMemberFormValues, isEdit: boolean) => {
    toast.success(isEdit ? "Member updated. (Mock)" : "Member added. (Mock)");
  };

  const handleDelete = () => {
    if (deleteId) {
      toast.success("Member removed. (Mock)");
      setDeleteId(null);
    }
  };

  const columns = React.useMemo(
    () => buildMemberColumns(handleView, handleEdit, (id) => setDeleteId(id)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale]
  );

  const isLoading =
    membersQuery.isLoading ||
    issuesQuery.isLoading ||
    studentsQuery.isLoading;

  if (isLoading) {
    return (
      <div data-testid="members-manager">
        <TableSkeleton columns={7} rows={6} />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="members-manager">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Library Members</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage library memberships for students, teachers, and employees.
          </p>
        </div>
        <Button
          onClick={() => setAddOpen(true)}
          size="sm"
          className="gap-1.5"
          data-testid="add-member-btn"
        >
          <Plus className="size-4" aria-hidden />
          Add Member
        </Button>
      </div>

      <MemberSummaryCards stats={stats} />

      <DataTable
        columns={columns}
        data={rows}
        filterConfigs={MEMBER_FILTER_CONFIGS}
        defaultPageSize={10}
        emptyTitle="No members found"
        emptyDescription="Add your first library member using the button above."
      />

      {/* Add Dialog */}
      <MemberFormDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSave={handleSave}
      />

      {/* Edit Dialog */}
      <MemberFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        member={editMember}
        onSave={handleSave}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => { if (!v) setDeleteId(null); }}
        title="Remove Member"
        description="Are you sure you want to remove this library member? Their borrowing history will be preserved."
        onConfirm={handleDelete}
      />
    </div>
  );
}
