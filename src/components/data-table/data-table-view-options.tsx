"use client";

import * as React from "react";
import { Columns3, Check } from "lucide-react";
import { type Table } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

/**
 * DataTableViewOptions — column visibility dropdown.
 * Renders a checkbox list of all hideable columns so the user can show/hide them.
 */
export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  const t = useTranslations("table");

  const hideableColumns = table
    .getAllColumns()
    .filter((col) => col.getCanHide());

  if (hideableColumns.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("showHideColumns")}
        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Columns3 className="size-4" aria-hidden />
        <span className="hidden sm:inline">{t("columns")}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel>{t("showHideColumns")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {hideableColumns.map((column) => {
          const isVisible = column.getIsVisible();
          return (
            <button
              key={column.id}
              role="menuitemcheckbox"
              aria-checked={isVisible}
              onClick={() => column.toggleVisibility(!isVisible)}
              className={cn(
                "relative flex w-full cursor-default items-center gap-2 rounded-md px-1.5 py-1 text-sm outline-hidden",
                "hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent"
              )}
            >
              <span
                className={cn(
                  "flex size-4 items-center justify-center rounded border border-input",
                  isVisible && "bg-primary border-primary text-primary-foreground"
                )}
              >
                {isVisible && <Check className="size-3" aria-hidden />}
              </span>
              <span className="capitalize">{column.id.replace(/_/g, " ")}</span>
            </button>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
