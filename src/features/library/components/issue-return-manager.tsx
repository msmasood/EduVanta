"use client";

import * as React from "react";
import { Plus, ArrowLeftRight } from "lucide-react";
import { toast } from "sonner";

import { DataTable, TableSkeleton } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { useBooks, useBookIssues, useLibraryMembers } from "@/hooks/queries/use-library";
import { useStudents } from "@/hooks/queries/use-students";
import { useTeachers } from "@/hooks/queries/use-teachers";
import { useEmployees } from "@/hooks/queries/use-employees";
import {
  mapIssuesToRows,
  mapMembersToRows,
  type IssueReturnRow,
} from "../utils/library-mappers";
import { computeIssueStats } from "../utils/library-calculations";
import { buildIssueColumns, ISSUE_FILTER_CONFIGS } from "./issue-return-columns";
import { IssueBookDialog } from "./issue-book-dialog";
import { ReturnBookDialog } from "./return-book-dialog";
import { IssueSummaryCards } from "./library-summary-cards";
import type { IssueBookFormValues, ReturnBookFormValues } from "@/lib/validations/library";
import { useParams } from "next/navigation";

export function IssueReturnManager() {
  const params = useParams<{ locale: string }>();
  const locale = typeof params?.locale === "string" ? params.locale : "en";

  const booksQuery = useBooks();
  const issuesQuery = useBookIssues();
  const membersQuery = useLibraryMembers();
  const studentsQuery = useStudents();
  const teachersQuery = useTeachers();
  const employeesQuery = useEmployees();

  const [issueOpen, setIssueOpen] = React.useState(false);
  const [returnOpen, setReturnOpen] = React.useState(false);
  const [activeIssue, setActiveIssue] = React.useState<IssueReturnRow | undefined>();

  const books = booksQuery.data?.data ?? [];
  const issuesRaw = issuesQuery.data?.data ?? [];
  const membersRaw = membersQuery.data?.data ?? [];
  const students = studentsQuery.data?.data ?? [];
  const teachers = teachersQuery.data?.data ?? [];
  const employees = employeesQuery.data?.data ?? [];

  const memberRows = React.useMemo(
    () => mapMembersToRows(membersRaw, issuesRaw, students, teachers, employees, locale),
    [membersRaw, issuesRaw, students, teachers, employees, locale]
  );

  const rows = React.useMemo(
    () => mapIssuesToRows(issuesRaw, books, membersRaw, students, teachers, employees, locale),
    [issuesRaw, books, membersRaw, students, teachers, employees, locale]
  );

  const stats = React.useMemo(() => computeIssueStats(issuesRaw), [issuesRaw]);

  const handleReturn = (row: IssueReturnRow) => {
    setActiveIssue(row);
    setReturnOpen(true);
  };

  const columns = React.useMemo(
    () => buildIssueColumns(handleReturn, locale),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale]
  );

  const isLoading =
    booksQuery.isLoading ||
    issuesQuery.isLoading ||
    membersQuery.isLoading ||
    studentsQuery.isLoading;

  const issueOptions = rows
    .filter((r) => r.status === "issued" || r.status === "overdue")
    .map((r) => ({ label: `${r.bookTitle} — ${r.memberName}`, value: r.id }));

  if (isLoading) {
    return (
      <div data-testid="issue-return-manager">
        <TableSkeleton columns={9} rows={6} />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="issue-return-manager">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Issue & Return</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track book issues, returns, overdue items and fines.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setReturnOpen(true)}
            variant="outline"
            size="sm"
            className="gap-1.5"
            data-testid="return-book-btn"
          >
            <ArrowLeftRight className="size-4" aria-hidden />
            Return Book
          </Button>
          <Button
            onClick={() => setIssueOpen(true)}
            size="sm"
            className="gap-1.5"
            data-testid="issue-book-btn"
          >
            <Plus className="size-4" aria-hidden />
            Issue Book
          </Button>
        </div>
      </div>

      <IssueSummaryCards stats={stats} />

      <DataTable
        columns={columns}
        data={rows}
        filterConfigs={ISSUE_FILTER_CONFIGS}
        defaultPageSize={10}
        emptyTitle="No issue records found"
        emptyDescription="Issue a book to a member to get started."
      />

      <IssueBookDialog
        open={issueOpen}
        onOpenChange={setIssueOpen}
        books={books}
        members={memberRows}
        onSave={(_v: IssueBookFormValues) => {
          toast.success("Book issued. (Mock)");
        }}
      />

      <ReturnBookDialog
        open={returnOpen}
        onOpenChange={(v) => {
          setReturnOpen(v);
          if (!v) setActiveIssue(undefined);
        }}
        issue={activeIssue}
        issueOptions={issueOptions}
        onSave={(_v: ReturnBookFormValues) => {
          toast.success("Book returned. (Mock)");
        }}
      />
    </div>
  );
}
