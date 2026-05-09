"use client";

import * as React from "react";
import { X, Download, RotateCcw } from "lucide-react";
import { type Table } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";

interface FilterConfig {
  columnId: string;
  title: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filterConfigs?: FilterConfig[];
  /** Called when the "Export CSV" button is clicked */
  onExport?: () => void;
  /** If true, shows the export button */
  showExport?: boolean;
}

/**
 * DataTableToolbar — global search, faceted filters, view options, export, reset.
 */
export function DataTableToolbar<TData>({
  table,
  filterConfigs,
  onExport,
  showExport = false,
}: DataTableToolbarProps<TData>) {
  const t = useTranslations("table");

  const isFiltered =
    table.getState().columnFilters.length > 0 ||
    !!table.getState().globalFilter;

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 px-2 py-2">
      {/* Left: search + filters */}
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {/* Global search */}
        <div className="relative">
          <Input
            placeholder={t("searchPlaceholder")}
            value={(table.getState().globalFilter as string) ?? ""}
            onChange={(e) =>
              table.setGlobalFilter(e.target.value)
            }
            aria-label={t("search")}
            className="h-8 w-48 sm:w-64"
          />
          {table.getState().globalFilter && (
            <button
              onClick={() => table.setGlobalFilter("")}
              className="absolute end-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="size-3.5" aria-hidden />
            </button>
          )}
        </div>

        {/* Faceted filters */}
        {filterConfigs?.map((cfg) => {
          const col = table.getColumn(cfg.columnId);
          if (!col) return null;
          return (
            <DataTableFacetedFilter
              key={cfg.columnId}
              column={col}
              title={cfg.title}
              options={cfg.options}
            />
          );
        })}

        {/* Reset filters */}
        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              table.resetColumnFilters();
              table.setGlobalFilter("");
            }}
            className="h-8 gap-1"
          >
            <RotateCcw className="size-3.5" aria-hidden />
            {t("resetFilters")}
          </Button>
        )}
      </div>

      {/* Right: view options + export */}
      <div className="flex items-center gap-2">
        {showExport && onExport && (
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            className="h-8 gap-1"
          >
            <Download className="size-3.5" aria-hidden />
            {t("exportCsv")}
          </Button>
        )}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
