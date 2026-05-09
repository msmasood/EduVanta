"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader, ActionMenu, StatusBadge } from "@/components/data-table";
import type { UserRoleRow } from "../utils/settings-mappers";
import type { FilterConfig } from "@/components/data-table";

export const USER_ROLE_FILTER_CONFIGS: FilterConfig[] = [
  {
    columnId: "entityType",
    title: "User Type",
    options: [
      { label: "Employee", value: "employee" },
      { label: "Teacher", value: "teacher" },
      { label: "Student", value: "student" },
      { label: "Guardian", value: "guardian" },
    ],
  },
  {
    columnId: "isActive",
    title: "Status",
    options: [
      { label: "Active", value: "true" },
      { label: "Inactive", value: "false" },
    ],
  },
];

export function buildUserRoleColumns(
  onEdit: (row: UserRoleRow) => void,
  onDelete: (id: string) => void,
): ColumnDef<UserRoleRow>[] {
  return [
    {
      accessorKey: "userName",
      header: ({ column }) => <DataTableColumnHeader column={column} title="User" />,
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.userName}</p>
          <p className="text-xs text-muted-foreground">{row.original.userEmail}</p>
        </div>
      ),
    },
    {
      accessorKey: "entityType",
      header: ({ column }) => <DataTableColumnHeader column={column} title="User Type" />,
      cell: ({ row }) => (
        <span className="text-sm capitalize">{row.original.entityType}</span>
      ),
    },
    {
      accessorKey: "roleName",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
      cell: ({ row }) => (
        <span className="font-medium text-sm">{row.original.roleName}</span>
      ),
    },
    {
      accessorKey: "assignedAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Assigned" />,
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {new Date(row.original.assignedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      ),
    },
    {
      accessorKey: "isActive",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => (
        <StatusBadge
          status={row.original.isActive ? "active" : "inactive"}
          label={row.original.isActive ? "Active" : "Inactive"}
        />
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <ActionMenu
          label={`Actions for ${row.original.userName}`}
          onEdit={() => onEdit(row.original)}
          onDelete={() => onDelete(row.original.id)}
        />
      ),
    },
  ];
}
