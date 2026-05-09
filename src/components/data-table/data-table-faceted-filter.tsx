"use client";

import * as React from "react";
import { Check, Filter } from "lucide-react";
import { type Column } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface FilterOption {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title: string;
  options: FilterOption[];
}

/**
 * DataTableFacetedFilter — faceted filter popover with checkboxes.
 * Integrates with TanStack Table's column filter state.
 */
export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const t = useTranslations("table");
  const facets = column?.getFacetedUniqueValues();
  const selectedValues = new Set(
    column?.getFilterValue() as string[] | undefined
  );

  return (
    <Popover>
      <PopoverTrigger
        aria-label={`${t("filterBy")} ${title}`}
        className={cn(
          "inline-flex h-8 items-center gap-1.5 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm",
          "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          selectedValues.size > 0 && "border-primary/60 bg-primary/5"
        )}
      >
        <Filter className="size-4" aria-hidden />
        {title}
        {selectedValues.size > 0 && (
          <span className="ms-1 rounded-full bg-primary/20 px-1.5 py-0 text-xs font-medium text-primary">
            {selectedValues.size}
          </span>
        )}
      </PopoverTrigger>
      <PopoverContent align="start" className="w-48 p-1">
        <div className="mb-1 px-2 py-1 text-xs font-medium text-muted-foreground">
          {title}
        </div>
        <div className="flex flex-col gap-0.5">
          {options.map((option) => {
            const isSelected = selectedValues.has(option.value);
            const count = facets?.get(option.value);

            return (
              <button
                key={option.value}
                role="menuitemcheckbox"
                aria-checked={isSelected}
                onClick={() => {
                  const next = new Set(selectedValues);
                  if (isSelected) {
                    next.delete(option.value);
                  } else {
                    next.add(option.value);
                  }
                  column?.setFilterValue(
                    next.size > 0 ? Array.from(next) : undefined
                  );
                }}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm",
                  "hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent outline-none",
                  isSelected && "text-foreground"
                )}
              >
                <span
                  className={cn(
                    "flex size-4 shrink-0 items-center justify-center rounded border border-input",
                    isSelected &&
                      "bg-primary border-primary text-primary-foreground"
                  )}
                >
                  {isSelected && <Check className="size-3" aria-hidden />}
                </span>
                {option.icon && (
                  <option.icon className="size-4 text-muted-foreground" aria-hidden />
                )}
                <span className="flex-1 text-start">{option.label}</span>
                {count !== undefined && (
                  <span className="ms-auto text-xs text-muted-foreground">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {selectedValues.size > 0 && (
          <div className="mt-1 border-t pt-1">
            <button
              onClick={() => column?.setFilterValue(undefined)}
              className="flex w-full items-center justify-center rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-foreground outline-none"
            >
              {t("clearFilters")}
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
