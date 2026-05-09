"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader, ActionMenu } from "@/components/data-table";
import { BookStatusBadge } from "./library-status-badges";
import type { BookRow } from "../utils/library-mappers";
import type { FilterConfig } from "@/components/data-table";

// ─── Filter configs ───────────────────────────────────────────────────────────

export const BOOK_FILTER_CONFIGS: FilterConfig[] = [
  {
    columnId: "status",
    title: "Status",
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ],
  },
  {
    columnId: "category",
    title: "Category",
    options: [
      { label: "Mathematics", value: "Mathematics" },
      { label: "English", value: "English" },
      { label: "Physics", value: "Physics" },
      { label: "Chemistry", value: "Chemistry" },
      { label: "Biology", value: "Biology" },
      { label: "Computer Science", value: "Computer Science" },
      { label: "Islamic Studies", value: "Islamic Studies" },
      { label: "Social Studies", value: "Social Studies" },
      { label: "Fiction", value: "Fiction" },
      { label: "Non-Fiction", value: "Non-Fiction" },
      { label: "Reference", value: "Reference" },
    ],
  },
];

// ─── Column builder ───────────────────────────────────────────────────────────

export function buildBookColumns(
  onEdit: (row: BookRow) => void,
  onDelete: (id: string) => void
): ColumnDef<BookRow>[] {
  return [
    {
      accessorKey: "title",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Book" />,
      cell: ({ row }) => (
        <div className="min-w-[180px]">
          <p className="font-medium leading-tight">{row.original.title}</p>
          <p className="text-xs text-muted-foreground">{row.original.author}</p>
          <p className="font-mono text-xs text-muted-foreground">{row.original.isbn}</p>
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
      cell: ({ row }) => <span className="text-sm">{row.original.category}</span>,
    },
    {
      accessorKey: "language",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Language" />,
      cell: ({ row }) => <span className="text-sm">{row.original.language}</span>,
    },
    {
      accessorKey: "totalCopies",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Total" />,
      cell: ({ row }) => (
        <span className="text-sm tabular-nums">{row.original.totalCopies}</span>
      ),
    },
    {
      accessorKey: "availableCopies",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Available" />,
      cell: ({ row }) => (
        <span className="text-sm tabular-nums font-medium text-green-700 dark:text-green-400">
          {row.original.availableCopies}
        </span>
      ),
    },
    {
      accessorKey: "shelfLocation",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Shelf" />,
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.original.shelfLocation}</span>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => <BookStatusBadge status={row.original.status} />,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <ActionMenu
          onEdit={() => onEdit(row.original)}
          onDelete={() => onDelete(row.original.id)}
          label="Book actions"
        />
      ),
    },
  ];
}
