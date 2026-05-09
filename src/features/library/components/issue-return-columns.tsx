"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import Link from "next/link";

import { DataTableColumnHeader, ActionMenu } from "@/components/data-table";
import { IssueStatusBadge } from "./library-status-badges";
import type { IssueReturnRow } from "../utils/library-mappers";
import type { FilterConfig } from "@/components/data-table";

// ─── Filter configs ───────────────────────────────────────────────────────────

export const ISSUE_FILTER_CONFIGS: FilterConfig[] = [
  {
    columnId: "status",
    title: "Status",
    options: [
      { label: "Issued", value: "issued" },
      { label: "Returned", value: "returned" },
      { label: "Overdue", value: "overdue" },
      { label: "Lost", value: "lost" },
    ],
  },
  {
    columnId: "memberType",
    title: "Member Type",
    options: [
      { label: "Student", value: "student" },
      { label: "Teacher", value: "teacher" },
      { label: "Employee", value: "employee" },
    ],
  },
];

// ─── Column builder ───────────────────────────────────────────────────────────

export function buildIssueColumns(
  onReturn: (row: IssueReturnRow) => void,
  locale = "en"
): ColumnDef<IssueReturnRow>[] {
  return [
    {
      accessorKey: "bookTitle",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Book" />,
      cell: ({ row }) => (
        <div className="min-w-[160px]">
          <p className="font-medium leading-tight">{row.original.bookTitle}</p>
          <p className="font-mono text-xs text-muted-foreground">{row.original.bookIsbn}</p>
        </div>
      ),
    },
    {
      accessorKey: "memberName",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Member" />,
      cell: ({ row }) => (
        <Link
          href={`/${locale}/library/members/${row.original.memberId}`}
          className="font-medium text-sm hover:underline text-primary"
        >
          {row.original.memberName}
        </Link>
      ),
    },
    {
      accessorKey: "memberType",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
      cell: ({ row }) => (
        <span className="text-sm">{row.original.memberTypeLabel}</span>
      ),
    },
    {
      accessorKey: "issueDate",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Issue Date" />,
      cell: ({ row }) => <span className="text-sm tabular-nums">{row.original.issueDate}</span>,
    },
    {
      accessorKey: "dueDate",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Due Date" />,
      cell: ({ row }) => <span className="text-sm tabular-nums">{row.original.dueDate}</span>,
    },
    {
      accessorKey: "returnDate",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Return Date" />,
      cell: ({ row }) => <span className="text-sm tabular-nums">{row.original.returnDate}</span>,
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => <IssueStatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "fineFormatted",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Fine" />,
      cell: ({ row }) => (
        <span className={`text-sm tabular-nums ${row.original.fine > 0 ? "text-destructive font-medium" : "text-muted-foreground"}`}>
          {row.original.fineFormatted}
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <ActionMenu
          extraItems={
            (row.original.status === "issued" || row.original.status === "overdue") ? (
              <button
                onClick={() => onReturn(row.original)}
                className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground w-full"
              >
                <Eye className="me-2 size-4 text-muted-foreground" aria-hidden />
                Return
              </button>
            ) : undefined
          }
          label="Issue actions"
        />
      ),
    },
  ];
}
