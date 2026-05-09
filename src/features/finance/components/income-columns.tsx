"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";

import { DataTableColumnHeader } from "@/components/data-table";
import { FinanceStatusBadge } from "./finance-status-badge";
import { FinanceAmountCell } from "./finance-amount-cell";
import type { IncomeRecordRow } from "../utils/finance-mappers";

export function buildIncomeColumns(
  onEdit: (row: IncomeRecordRow) => void,
  onDelete: (id: string) => void,
  locale = "en"
): ColumnDef<IncomeRecordRow>[] {
  return [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title / Source" />
      ),
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.title}</p>
          <p className="text-xs text-muted-foreground">{row.original.invoiceNumber}</p>
        </div>
      ),
    },
    {
      accessorKey: "incomeHeadName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Income Head" />
      ),
      cell: ({ row }) => (
        <span className="text-sm">{row.original.incomeHeadName}</span>
      ),
    },
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Amount" />
      ),
      cell: ({ row }) => (
        <FinanceAmountCell
          amount={row.original.amount}
          currency={row.original.currency}
          locale={locale}
        />
      ),
    },
    {
      accessorKey: "receivedFrom",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Received From" />
      ),
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.receivedFrom}
        </span>
      ),
    },
    {
      accessorKey: "paymentMethodLabel",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Payment Method" />
      ),
      cell: ({ row }) => (
        <span className="text-sm">{row.original.paymentMethodLabel}</span>
      ),
    },
    {
      accessorKey: "date",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date" />
      ),
      cell: ({ row }) => (
        <span className="text-sm tabular-nums">{row.original.date}</span>
      ),
    },
    {
      accessorKey: "referenceNumber",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Reference" />
      ),
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.original.referenceNumber}</span>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => (
        <FinanceStatusBadge status={row.original.status} type="income" />
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(row.original)}
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Edit income record"
          >
            <Pencil className="size-4" aria-hidden />
          </button>
          <button
            onClick={() => onDelete(row.original.id)}
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-destructive"
            aria-label="Delete income record"
          >
            <Trash2 className="size-4" aria-hidden />
          </button>
        </div>
      ),
    },
  ];
}
