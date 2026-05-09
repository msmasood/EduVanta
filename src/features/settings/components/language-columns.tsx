"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader, ActionMenu, StatusBadge } from "@/components/data-table";
import type { LanguageRow } from "../utils/settings-mappers";
import type { FilterConfig } from "@/components/data-table";

export const LANGUAGE_FILTER_CONFIGS: FilterConfig[] = [
  {
    columnId: "direction",
    title: "Direction",
    options: [
      { label: "LTR", value: "ltr" },
      { label: "RTL", value: "rtl" },
    ],
  },
];

export function buildLanguageColumns(
  onEdit: (row: LanguageRow) => void,
): ColumnDef<LanguageRow>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Language" />,
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.name}</p>
          <p className="text-sm text-muted-foreground">{row.original.nativeName}</p>
        </div>
      ),
    },
    {
      accessorKey: "locale",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Locale" />,
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.original.locale}</span>
      ),
    },
    {
      accessorKey: "direction",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Direction" />,
      cell: ({ row }) => (
        <span className="text-sm uppercase">{row.original.direction}</span>
      ),
    },
    {
      accessorKey: "isDefault",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Default" />,
      cell: ({ row }) => (
        row.original.isDefault
          ? <StatusBadge status="active" label="Default" />
          : <span className="text-sm text-muted-foreground">—</span>
      ),
    },
    {
      accessorKey: "isEnabled",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => (
        <StatusBadge
          status={row.original.isEnabled ? "active" : "inactive"}
          label={row.original.isEnabled ? "Enabled" : "Disabled"}
        />
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <ActionMenu
          label={`Actions for ${row.original.name}`}
          onEdit={() => onEdit(row.original)}
        />
      ),
    },
  ];
}
