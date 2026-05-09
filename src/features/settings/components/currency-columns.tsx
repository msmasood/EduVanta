"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader, ActionMenu, StatusBadge } from "@/components/data-table";
import type { CurrencyRow } from "../utils/settings-mappers";
import type { FilterConfig } from "@/components/data-table";

export const CURRENCY_FILTER_CONFIGS: FilterConfig[] = [
  {
    columnId: "isEnabled",
    title: "Status",
    options: [
      { label: "Enabled", value: "true" },
      { label: "Disabled", value: "false" },
    ],
  },
];

export function buildCurrencyColumns(
  onEdit: (row: CurrencyRow) => void,
): ColumnDef<CurrencyRow>[] {
  return [
    {
      accessorKey: "code",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Code" />,
      cell: ({ row }) => (
        <span className="font-mono font-semibold text-sm">{row.original.code}</span>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Currency" />,
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.name}</p>
          <p className="text-sm text-muted-foreground">{row.original.symbol}</p>
        </div>
      ),
    },
    {
      accessorKey: "formattedRate",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Exchange Rate (vs USD)" />,
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.original.formattedRate}</span>
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
          label={`Actions for ${row.original.code}`}
          onEdit={() => onEdit(row.original)}
        />
      ),
    },
  ];
}
