"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";

import { DataTableColumnHeader } from "@/components/data-table";
import { formatCurrency, type CurrencyCode } from "@/lib/currency";
import type { FeeTypeRow } from "../utils/fee-mappers";

export function buildFeeTypeColumns(
  onEdit: (row: FeeTypeRow) => void,
  onDelete: (id: string) => void,
  locale = "en"
): ColumnDef<FeeTypeRow>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Type Name" />
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "groupName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Group" />
      ),
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.groupName || "—"}
        </span>
      ),
    },
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Amount" />
      ),
      cell: ({ row }) => (
        <span className="tabular-nums font-medium">
          {formatCurrency(row.original.amount, row.original.currency, locale)}
        </span>
      ),
    },
    {
      accessorKey: "frequency",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Frequency" />
      ),
      cell: ({ row }) => (
        <span className="capitalize text-sm">{row.original.frequency}</span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(row.original)}
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Edit type"
          >
            <Pencil className="size-4" aria-hidden />
          </button>
          <button
            onClick={() => onDelete(row.original.id)}
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-destructive"
            aria-label="Delete type"
          >
            <Trash2 className="size-4" aria-hidden />
          </button>
        </div>
      ),
    },
  ];
}
