"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import { TableSkeleton } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import {
  useLibraryMember,
  useBookIssues,
  useMemberIssues,
  useBooks,
} from "@/hooks/queries/use-library";
import { useStudents } from "@/hooks/queries/use-students";
import { useTeachers } from "@/hooks/queries/use-teachers";
import { useEmployees } from "@/hooks/queries/use-employees";
import {
  mapMembersToRows,
  mapMemberCurrentIssues,
  mapMemberHistory,
} from "../utils/library-mappers";
import { memberTypeLabel } from "../utils/library-mappers";
import { MemberProfileHeader } from "./member-profile-header";
import { MemberInfoCard } from "./member-info-card";
import { MemberCurrentIssuesCard } from "./member-current-issues-card";
import { MemberBorrowingHistory } from "./member-borrowing-history";
import { MemberFormDialog } from "./member-form-dialog";
import type { LibraryMemberFormValues } from "@/lib/validations/library";
import { formatShortDate } from "@/lib/dates";

interface MemberDetailViewProps {
  memberId: string;
}

export function MemberDetailView({ memberId }: MemberDetailViewProps) {
  const params = useParams<{ locale: string }>();
  const locale = typeof params?.locale === "string" ? params.locale : "en";

  const memberQuery = useLibraryMember(memberId);
  const memberIssuesQuery = useMemberIssues(memberId);
  const booksQuery = useBooks();
  const studentsQuery = useStudents();
  const teachersQuery = useTeachers();
  const employeesQuery = useEmployees();

  const [editOpen, setEditOpen] = React.useState(false);

  const member = memberQuery.data?.data ?? null;
  const issues = memberIssuesQuery.data?.data ?? [];
  const books = booksQuery.data?.data ?? [];
  const students = studentsQuery.data?.data ?? [];
  const teachers = teachersQuery.data?.data ?? [];
  const employees = employeesQuery.data?.data ?? [];

  const isLoading =
    memberQuery.isLoading || memberIssuesQuery.isLoading || booksQuery.isLoading;

  // Derive name / initials from linked entity
  const { memberName, memberInitials } = React.useMemo(() => {
    if (!member) return { memberName: "—", memberInitials: "?" };
    if (member.memberType === "student") {
      const s = students.find((s) => s.id === member.entityId);
      if (s) return { memberName: `${s.firstName} ${s.lastName}`, memberInitials: `${s.firstName[0]}${s.lastName[0]}`.toUpperCase() };
    } else if (member.memberType === "teacher") {
      const t = teachers.find((t) => t.id === member.entityId);
      if (t) return { memberName: `${t.firstName} ${t.lastName}`, memberInitials: `${t.firstName[0]}${t.lastName[0]}`.toUpperCase() };
    } else if (member.memberType === "employee") {
      const e = employees.find((e) => e.id === member.entityId);
      if (e) return { memberName: `${e.firstName} ${e.lastName}`, memberInitials: `${e.firstName[0]}${e.lastName[0]}`.toUpperCase() };
    }
    return { memberName: "—", memberInitials: "?" };
  }, [member, students, teachers, employees]);

  const currentIssues = React.useMemo(
    () => mapMemberCurrentIssues(issues, books, locale),
    [issues, books, locale]
  );

  const history = React.useMemo(
    () => mapMemberHistory(issues, books, locale),
    [issues, books, locale]
  );

  const activeIssues = currentIssues.length;
  const overdueCount = currentIssues.filter((i) => i.isOverdue).length;
  const totalBorrowed = issues.length;

  if (isLoading) {
    return (
      <div>
        <TableSkeleton columns={4} rows={4} />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">Member not found.</p>
      </div>
    );
  }

  // Build MemberRow for the form
  const memberRows = mapMembersToRows([member], issues, students, teachers, employees, locale);
  const memberRow = memberRows[0];

  return (
    <div className="space-y-6">
      <MemberProfileHeader
        id={member.id}
        name={memberName}
        initials={memberInitials}
        membershipNumber={member.membershipId}
        memberTypeLabel={memberTypeLabel(member.memberType)}
        joinedDate={formatShortDate(member.registeredAt, locale)}
        status={member.status}
        backHref={`/${locale}/library/members`}
      />

      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
          Edit Member
        </Button>
      </div>

      <MemberInfoCard
        activeIssues={activeIssues}
        totalBorrowed={totalBorrowed}
        maxBooksAllowed={member.maxBooksAllowed ?? 5}
        overdueCount={overdueCount}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <MemberCurrentIssuesCard issues={currentIssues} />
        <MemberBorrowingHistory history={history} />
      </div>

      {memberRow && (
        <MemberFormDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          member={memberRow}
          onSave={(_values: LibraryMemberFormValues, _isEdit: boolean) => {
            toast.success("Member updated. (Mock)");
          }}
        />
      )}
    </div>
  );
}
