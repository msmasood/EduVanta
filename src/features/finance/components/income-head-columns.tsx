"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";

import { DataTableColumnHeader } from "@/components/data-table";
import { FinanceStatusBadge } from "./finance-status-badge";
import type { IncomeHeadRow } from "../utils/finance-mappers";

export function buildIncomeHeadColumns(
  onEdit: (row: IncomeHeadRow) => void,
  onDelete: (id: string) => void
): ColumnDef<IncomeHeadRow>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Head Name" />
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "code",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Code" />
      ),
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.original.code || "—"}</span>
      ),
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Description" />
      ),
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.description || "—"}
        </span>
      ),
    },
    {
      accessorKey: "incomeRecordsCount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Records" />
      ),
      cell: ({ row }) => (
        <span className="tabular-nums">{row.original.incomeRecordsCount}</span>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => (
        <FinanceStatusBadge status={row.original.status} type="head" />
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(row.original)}
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Edit income head"
          >
            <Pencil className="size-4" aria-hidden />
          </button>
          <button
            onClick={() => onDelete(row.original.id)}
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-destructive"
            aria-label="Delete income head"
          >
            <Trash2 className="size-4" aria-hidden />
          </button>
        </div>
      ),
    },
  ];
}
