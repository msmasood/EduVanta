"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";

import { DataTableColumnHeader } from "@/components/data-table";
import { FinanceStatusBadge } from "./finance-status-badge";
import { FinanceAmountCell } from "./finance-amount-cell";
import type { ExpenseRecordRow } from "../utils/finance-mappers";

export function buildExpenseColumns(
  onEdit: (row: ExpenseRecordRow) => void,
  onDelete: (id: string) => void,
  locale = "en"
): ColumnDef<ExpenseRecordRow>[] {
  return [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title / Paid To" />
      ),
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.title}</p>
          <p className="text-xs text-muted-foreground">{row.original.invoiceNumber}</p>
        </div>
      ),
    },
    {
      accessorKey: "expenseHeadName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Expense Head" />
      ),
      cell: ({ row }) => (
        <span className="text-sm">{row.original.expenseHeadName}</span>
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
          negative
        />
      ),
    },
    {
      accessorKey: "paidTo",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Paid To" />
      ),
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{row.original.paidTo}</span>
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
        <FinanceStatusBadge status={row.original.status} type="expense" />
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(row.original)}
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Edit expense record"
          >
            <Pencil className="size-4" aria-hidden />
          </button>
          <button
            onClick={() => onDelete(row.original.id)}
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-destructive"
            aria-label="Delete expense record"
          >
            <Trash2 className="size-4" aria-hidden />
          </button>
        </div>
      ),
    },
  ];
}
