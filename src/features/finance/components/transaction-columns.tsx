"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";

import { DataTableColumnHeader } from "@/components/data-table";
import { FinanceStatusBadge } from "./finance-status-badge";
import { FinanceTypeBadge } from "./finance-type-badge";
import { FinanceAmountCell } from "./finance-amount-cell";
import type { TransactionRow } from "../utils/finance-mappers";

export function buildTransactionColumns(
  onView: (row: TransactionRow) => void,
  locale = "en"
): ColumnDef<TransactionRow>[] {
  return [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Transaction ID" />
      ),
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.original.id}</span>
      ),
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Type" />
      ),
      cell: ({ row }) => (
        <FinanceTypeBadge type={row.original.type} />
      ),
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Description" />
      ),
      cell: ({ row }) => (
        <span className="max-w-[200px] truncate text-sm">{row.original.description}</span>
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
      accessorKey: "paymentMethodLabel",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Payment Method" />
      ),
      cell: ({ row }) => (
        <span className="text-sm">{row.original.paymentMethodLabel || "—"}</span>
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
        <FinanceStatusBadge status={row.original.status} type="transaction" />
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <button
          onClick={() => onView(row.original)}
          className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="View transaction"
        >
          <Eye className="size-4" aria-hidden />
        </button>
      ),
    },
  ];
}
