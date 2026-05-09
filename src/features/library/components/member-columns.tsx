"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";

import { DataTableColumnHeader, ActionMenu } from "@/components/data-table";
import { MemberStatusBadge } from "./library-status-badges";
import type { MemberRow } from "../utils/library-mappers";
import type { FilterConfig } from "@/components/data-table";

// ─── Filter configs ───────────────────────────────────────────────────────────

export const MEMBER_FILTER_CONFIGS: FilterConfig[] = [
  {
    columnId: "status",
    title: "Status",
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
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

export function buildMemberColumns(
  onView: (row: MemberRow) => void,
  onEdit: (row: MemberRow) => void,
  onDelete: (id: string) => void
): ColumnDef<MemberRow>[] {
  return [
    {
      accessorKey: "memberName",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => (
        <button
          onClick={() => onView(row.original)}
          className="text-start font-medium text-sm hover:underline text-primary"
        >
          {row.original.memberName}
        </button>
      ),
    },
    {
      accessorKey: "membershipNumber",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Membership #" />,
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.original.membershipNumber}</span>
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
      accessorKey: "joinedDate",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Joined" />,
      cell: ({ row }) => (
        <span className="text-sm tabular-nums">{row.original.joinedDate}</span>
      ),
    },
    {
      accessorKey: "activeIssues",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Active Issues" />,
      cell: ({ row }) => (
        <span className="tabular-nums text-sm">{row.original.activeIssues}</span>
      ),
    },
    {
      accessorKey: "totalBorrowed",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Total Borrowed" />,
      cell: ({ row }) => (
        <span className="tabular-nums text-sm">{row.original.totalBorrowed}</span>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => <MemberStatusBadge status={row.original.status} />,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <ActionMenu
          onView={() => onView(row.original)}
          onEdit={() => onEdit(row.original)}
          onDelete={() => onDelete(row.original.id)}
          label="Member actions"
        />
      ),
    },
  ];
}
