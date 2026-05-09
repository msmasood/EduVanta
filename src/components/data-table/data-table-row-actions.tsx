"use client";

import { MoreHorizontal } from "lucide-react";
import { type Row } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

import { ActionMenu } from "./action-menu";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  onView?: (row: Row<TData>) => void;
  onEdit?: (row: Row<TData>) => void;
  onDelete?: (row: Row<TData>) => void;
  onDuplicate?: (row: Row<TData>) => void;
}

/**
 * DataTableRowActions — wraps ActionMenu with row-aware callbacks.
 * Drop this into a column def's `cell` renderer.
 *
 * @example
 * ```tsx
 * {
 *   id: "actions",
 *   cell: ({ row }) => (
 *     <DataTableRowActions
 *       row={row}
 *       onEdit={(row) => router.push(`/students/${row.original.id}/edit`)}
 *       onDelete={(row) => handleDelete(row.original.id)}
 *     />
 *   ),
 * }
 * ```
 */
export function DataTableRowActions<TData>({
  row,
  onView,
  onEdit,
  onDelete,
  onDuplicate,
}: DataTableRowActionsProps<TData>) {
  const t = useTranslations("table");

  return (
    <ActionMenu
      label={t("actions")}
      onView={onView ? () => onView(row) : undefined}
      onEdit={onEdit ? () => onEdit(row) : undefined}
      onDelete={onDelete ? () => onDelete(row) : undefined}
      onDuplicate={onDuplicate ? () => onDuplicate(row) : undefined}
    />
  );
}

// Re-export icon for convenience in custom cell renderers
export { MoreHorizontal };
