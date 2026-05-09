"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Pin } from "lucide-react";
import { DataTableColumnHeader, ActionMenu } from "@/components/data-table";
import { NoticePriorityBadge, NoticeAudienceBadge } from "./communication-badges";
import type { NoticeRow } from "../utils/communication-mappers";
import type { FilterConfig } from "@/components/data-table";

// ─── Filter configs ───────────────────────────────────────────────────────────

export const NOTICE_FILTER_CONFIGS: FilterConfig[] = [
  {
    columnId: "priority",
    title: "Priority",
    options: [
      { label: "Low", value: "low" },
      { label: "Medium", value: "medium" },
      { label: "High", value: "high" },
      { label: "Urgent", value: "urgent" },
    ],
  },
  {
    columnId: "status",
    title: "Status",
    options: [
      { label: "Draft", value: "draft" },
      { label: "Published", value: "published" },
      { label: "Archived", value: "archived" },
    ],
  },
];

// ─── Column builder ───────────────────────────────────────────────────────────

export function buildNoticeColumns(
  onEdit: (row: NoticeRow) => void,
  onDelete: (id: string) => void
): ColumnDef<NoticeRow>[] {
  return [
    {
      accessorKey: "title",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
      cell: ({ row }) => (
        <div className="min-w-[200px]">
          <div className="flex items-center gap-1.5">
            {row.original.isPinned && <Pin className="size-3 text-amber-500" aria-label="Pinned" />}
            <p className="font-medium leading-tight">{row.original.title}</p>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-1">{row.original.body}</p>
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
      cell: ({ row }) => <span className="text-sm">{row.original.category}</span>,
    },
    {
      accessorKey: "priority",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Priority" />,
      cell: ({ row }) => <NoticePriorityBadge priority={row.original.priority} />,
    },
    {
      accessorKey: "audience",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Audience" />,
      cell: ({ row }) => <NoticeAudienceBadge audience={row.original.audience} />,
    },
    {
      accessorKey: "publishedAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Published" />,
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.publishedAt}</span>,
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => (
        <span className="text-sm capitalize">{row.original.status}</span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <ActionMenu
          onEdit={() => onEdit(row.original)}
          onDelete={() => onDelete(row.original.id)}
        />
      ),
    },
  ];
}
