"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader, ActionMenu } from "@/components/data-table";
import { NotificationStatusBadge, NotificationCategoryBadge } from "./notification-status-badge";
import type { NotificationRow } from "../utils/notification-mappers";
import type { FilterConfig } from "@/components/data-table";

// ─── Filter configs ───────────────────────────────────────────────────────────

export const NOTIFICATION_FILTER_CONFIGS: FilterConfig[] = [
  {
    columnId: "category",
    title: "Category",
    options: [
      { label: "Fees", value: "fees" },
      { label: "Attendance", value: "attendance" },
      { label: "Exam", value: "exam" },
      { label: "Leave", value: "leave" },
      { label: "Notice", value: "notice" },
      { label: "Message", value: "message" },
      { label: "System", value: "system" },
    ],
  },
];

// ─── Column builder ───────────────────────────────────────────────────────────

export function buildNotificationColumns(
  onMarkRead: (id: string) => void,
  onDismiss: (id: string) => void
): ColumnDef<NotificationRow>[] {
  return [
    {
      accessorKey: "title",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Notification" />,
      cell: ({ row }) => (
        <div className="min-w-[220px]">
          <p className="font-medium text-sm">{row.original.title}</p>
          <p className="text-xs text-muted-foreground line-clamp-1">{row.original.body}</p>
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
      cell: ({ row }) => <NotificationCategoryBadge category={row.original.category} />,
    },
    {
      accessorKey: "isRead",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => <NotificationStatusBadge isRead={row.original.isRead} />,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Received" />,
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.createdAt}</span>,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <ActionMenu
          onView={() => onMarkRead(row.original.id)}
          onDelete={() => onDismiss(row.original.id)}
          label="Actions"
        />
      ),
    },
  ];
}
