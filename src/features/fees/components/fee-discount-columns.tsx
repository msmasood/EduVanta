"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";

import { DataTableColumnHeader, StatusBadge } from "@/components/data-table";
import type { FeeDiscountRow } from "../utils/fee-mappers";

export function buildFeeDiscountColumns(
  onEdit: (row: FeeDiscountRow) => void,
  onDelete: (id: string) => void
): ColumnDef<FeeDiscountRow>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Discount Name" />
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "discountType",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Type" />
      ),
      cell: ({ row }) => (
        <StatusBadge
          status={row.original.discountType === "percentage" ? "info" : "neutral"}
          label={
            row.original.discountType === "percentage" ? "Percentage" : "Fixed"
          }
        />
      ),
    },
    {
      accessorKey: "valueDisplay",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Value" />
      ),
      cell: ({ row }) => (
        <span className="tabular-nums font-medium">{row.original.valueDisplay}</span>
      ),
    },
    {
      accessorKey: "applicableCount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Applies To" />
      ),
      cell: ({ row }) => (
        <span className="text-sm tabular-nums">
          {row.original.applicableCount > 0
            ? `${row.original.applicableCount} type(s)`
            : "All"}
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(row.original)}
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Edit discount"
          >
            <Pencil className="size-4" aria-hidden />
          </button>
          <button
            onClick={() => onDelete(row.original.id)}
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-destructive"
            aria-label="Delete discount"
          >
            <Trash2 className="size-4" aria-hidden />
          </button>
        </div>
      ),
    },
  ];
}
