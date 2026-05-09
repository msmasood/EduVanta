"use client";

import * as React from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  type RowSelectionState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type Table as TanTable,
} from "@tanstack/react-table";
import { useTranslations } from "next-intl";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableToolbar } from "./data-table-toolbar";
import { DataTablePagination } from "./data-table-pagination";
import { EmptyTableState } from "./empty-table-state";
import { TableSkeleton } from "./table-skeleton";
import type { StatusVariant } from "./status-badge";

// ─── Filter config type ──────────────────────────────────────────────────────

export interface FilterConfig {
  columnId: string;
  title: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
}

// ─── Main DataTable props ────────────────────────────────────────────────────

export interface DataTableProps<TData> {
  /** Column definitions */
  columns: ColumnDef<TData>[];
  /** Row data */
  data: TData[];
  /** Show loading skeleton instead of rows */
  isLoading?: boolean;
  /** Show row selection checkboxes */
  selectable?: boolean;
  /** Faceted filter configs */
  filterConfigs?: FilterConfig[];
  /** Show export button in toolbar */
  showExport?: boolean;
  /** Called when user clicks Export */
  onExport?: (table: TanTable<TData>) => void;
  /** Initial page size */
  defaultPageSize?: number;
  /** Available page size options */
  pageSizeOptions?: number[];
  /** Text shown in empty state title */
  emptyTitle?: string;
  /** Text shown in empty state description */
  emptyDescription?: string;
  /** Optional footer content rendered below the pagination */
  footer?: React.ReactNode;
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * DataTable<TData> — generic, fully-featured data table built on TanStack Table v8.
 *
 * Includes: global search, faceted column filters, column visibility,
 * sortable headers, row selection, pagination, loading skeleton, empty state,
 * and optional CSV export.
 */
export function DataTable<TData>({
  columns,
  data,
  isLoading = false,
  selectable = false,
  filterConfigs,
  showExport = false,
  onExport,
  defaultPageSize = 10,
  pageSizeOptions,
  emptyTitle,
  emptyDescription,
  footer,
}: DataTableProps<TData>) {
  const t = useTranslations("table");

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] =
    React.useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = React.useState<string>("");

  // Prepend selection column if selectable
  const effectiveColumns = React.useMemo<ColumnDef<TData>[]>(() => {
    if (!selectable) return columns;
    const selectionCol: ColumnDef<TData> = {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected()
              ? true
              : table.getIsSomePageRowsSelected()
              ? undefined
              : false
          }
          onCheckedChange={(v) =>
            table.toggleAllPageRowsSelected(v === true)
          }
          aria-label={t("selected")}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(v) => row.toggleSelected(v === true)}
          aria-label={t("selected")}
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
    };
    return [selectionCol, ...columns];
  }, [columns, selectable, t]);

  const table = useReactTable({
    data,
    columns: effectiveColumns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    enableRowSelection: selectable,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    initialState: {
      pagination: { pageSize: defaultPageSize },
    },
  });

  const handleExport = React.useCallback(() => {
    onExport?.(table);
  }, [onExport, table]);

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <DataTableToolbar
        table={table}
        filterConfigs={filterConfigs}
        showExport={showExport}
        onExport={onExport ? handleExport : undefined}
      />

      {/* Table */}
      <div className="rounded-lg border overflow-hidden">
        {isLoading ? (
          <div className="p-4">
            <TableSkeleton rows={defaultPageSize} columns={columns.length} />
          </div>
        ) : (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      style={
                        header.column.columnDef.size
                          ? { width: header.column.columnDef.size }
                          : undefined
                      }
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={effectiveColumns.length}
                    className="p-0"
                  >
                    <EmptyTableState
                      title={emptyTitle ?? t("noResults")}
                      description={emptyDescription}
                    />
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() ? "selected" : undefined}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination */}
      {!isLoading && (
        <DataTablePagination table={table} pageSizeOptions={pageSizeOptions} />
      )}

      {footer}
    </div>
  );
}

// Re-export for convenience
export type { StatusVariant };
