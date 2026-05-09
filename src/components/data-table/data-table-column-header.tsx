"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, EyeOff } from "lucide-react";
import { type Column } from "@tanstack/react-table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

/**
 * DataTableColumnHeader — sortable column header with asc/desc/clear controls.
 * Non-sortable columns render as plain text.
 */
export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return (
      <div className={cn("text-sm font-medium", className)}>
        {title}
      </div>
    );
  }

  const sorted = column.getIsSorted();

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={`Sort by ${title}`}
          className="inline-flex items-center gap-1 rounded px-1 py-0.5 text-sm font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {title}
          {sorted === "desc" ? (
            <ArrowDown className="size-3.5" aria-hidden />
          ) : sorted === "asc" ? (
            <ArrowUp className="size-3.5" aria-hidden />
          ) : (
            <ArrowUpDown className="size-3.5 text-muted-foreground" aria-hidden />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUp className="me-2 size-3.5 text-muted-foreground" aria-hidden />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDown className="me-2 size-3.5 text-muted-foreground" aria-hidden />
            Desc
          </DropdownMenuItem>
          {sorted && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => column.clearSorting()}>
                <ArrowUpDown className="me-2 size-3.5 text-muted-foreground" aria-hidden />
                Clear sort
              </DropdownMenuItem>
            </>
          )}
          {column.getCanHide() && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => column.toggleVisibility(false)}
              >
                <EyeOff className="me-2 size-3.5 text-muted-foreground" aria-hidden />
                Hide column
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
