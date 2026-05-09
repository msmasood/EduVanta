"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader, ActionMenu, StatusBadge } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import type { RoleRow } from "../utils/settings-mappers";
import type { FilterConfig } from "@/components/data-table";

export const ROLE_FILTER_CONFIGS: FilterConfig[] = [
  {
    columnId: "isActive",
    title: "Status",
    options: [
      { label: "Active", value: "true" },
      { label: "Inactive", value: "false" },
    ],
  },
];

export function buildRoleColumns(
  onEdit: (row: RoleRow) => void,
  onDelete: (id: string) => void,
  onView: (row: RoleRow) => void,
): ColumnDef<RoleRow>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.name}</p>
          {row.original.isSystem && (
            <Badge variant="secondary" className="text-xs mt-0.5">System</Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Description" />,
      cell: ({ row }) => (
        <p className="text-sm text-muted-foreground max-w-[300px] line-clamp-2">
          {row.original.description}
        </p>
      ),
    },
    {
      accessorKey: "moduleCount",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Modules" />,
      cell: ({ row }) => (
        <span className="text-sm tabular-nums">{row.original.moduleCount}</span>
      ),
    },
    {
      accessorKey: "permissionCount",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Permissions" />,
      cell: ({ row }) => (
        <span className="text-sm tabular-nums">{row.original.permissionCount}</span>
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
          label={`Actions for ${row.original.name}`}
          onView={() => onView(row.original)}
          onEdit={row.original.isSystem ? undefined : () => onEdit(row.original)}
          onDelete={row.original.isSystem ? undefined : () => onDelete(row.original.id)}
        />
      ),
    },
  ];
}
