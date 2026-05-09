"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Receipt, CreditCard, Trash2 } from "lucide-react";
import { formatCurrency, type CurrencyCode } from "@/lib/currency";

import {
  DataTableColumnHeader,
  StatusBadge,
  AvatarCell,
} from "@/components/data-table";
import type { FeeInvoiceRow } from "../utils/fee-mappers";
import type { FilterConfig } from "@/components/data-table/data-table";

// ─── Invoice status filter options ────────────────────────────────────────────

export const invoiceFilterConfigs: FilterConfig[] = [
  {
    columnId: "status",
    title: "Status",
    options: [
      { label: "Paid", value: "paid" },
      { label: "Partial", value: "partial" },
      { label: "Overdue", value: "overdue" },
      { label: "Waived", value: "waived" },
    ],
  },
];

// ─── Column builder ────────────────────────────────────────────────────────────

export function buildFeeInvoiceColumns(
  onCollect: (row: FeeInvoiceRow) => void,
  onReceipt: (row: FeeInvoiceRow) => void,
  onDelete: (id: string) => void,
  locale = "en"
): ColumnDef<FeeInvoiceRow>[] {
  return [
    {
      accessorKey: "invoiceNumber",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Invoice" />
      ),
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-sm">{row.original.invoiceNumber}</p>
          <p className="text-xs text-muted-foreground">{row.original.dueDate}</p>
        </div>
      ),
    },
    {
      accessorKey: "studentName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Student" />
      ),
      cell: ({ row }) => (
        <AvatarCell
          name={row.original.studentName}
          subtitle={row.original.admissionNumber}
        />
      ),
    },
    {
      accessorKey: "feeGroupName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Group" />
      ),
    },
    {
      accessorKey: "feeTypeName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Type" />
      ),
    },
    {
      accessorKey: "netAmount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Amount" />
      ),
      cell: ({ row }) => (
        <span className="tabular-nums font-medium">
          {formatCurrency(
            row.original.netAmount,
            row.original.currency as CurrencyCode,
            locale
          )}
        </span>
      ),
    },
    {
      accessorKey: "paidAmount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Paid" />
      ),
      cell: ({ row }) => (
        <span className="tabular-nums text-emerald-600 dark:text-emerald-400">
          {formatCurrency(
            row.original.paidAmount,
            row.original.currency as CurrencyCode,
            locale
          )}
        </span>
      ),
    },
    {
      accessorKey: "balance",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Balance" />
      ),
      cell: ({ row }) => (
        <span
          className={`tabular-nums ${
            row.original.balance > 0 ? "text-destructive font-medium" : ""
          }`}
        >
          {formatCurrency(
            row.original.balance,
            row.original.currency as CurrencyCode,
            locale
          )}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => (
        <StatusBadge
          status={row.original.statusVariant}
          label={row.original.statusLabel}
        />
      ),
      filterFn: (row, columnId, filterValues: string[]) => {
        if (!filterValues.length) return true;
        return filterValues.includes(row.getValue(columnId));
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-1">
          <button
            onClick={() => onCollect(row.original)}
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Collect payment"
            title="Collect Payment"
          >
            <CreditCard className="size-4" aria-hidden />
          </button>
          <button
            onClick={() => onReceipt(row.original)}
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="View receipt"
            title="View Receipt"
          >
            <Receipt className="size-4" aria-hidden />
          </button>
          <button
            onClick={() => onDelete(row.original.id)}
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-destructive"
            aria-label="Delete invoice"
          >
            <Trash2 className="size-4" aria-hidden />
          </button>
        </div>
      ),
    },
  ];
}
