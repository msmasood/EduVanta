"use client";

import * as React from "react";
import { MoreHorizontal, Eye, Pencil, Trash2, Copy } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ActionMenuProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  /** Extra custom items appended after the standard ones */
  extraItems?: React.ReactNode;
  /** Accessible label for the trigger button */
  label?: string;
}

/**
 * ActionMenu — reusable 3-dot action menu for DataTable rows.
 * Shows View / Edit / Duplicate / Delete based on which callbacks are provided.
 */
export function ActionMenu({
  onView,
  onEdit,
  onDelete,
  onDuplicate,
  extraItems,
  label,
}: ActionMenuProps) {
  const t = useTranslations("table");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={label ?? t("actions")}
        className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <MoreHorizontal className="size-4" aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        {onView && (
          <DropdownMenuItem onClick={onView}>
            <Eye className="me-2 size-4 text-muted-foreground" aria-hidden />
            {t("view")}
          </DropdownMenuItem>
        )}
        {onEdit && (
          <DropdownMenuItem onClick={onEdit}>
            <Pencil className="me-2 size-4 text-muted-foreground" aria-hidden />
            {t("edit")}
          </DropdownMenuItem>
        )}
        {onDuplicate && (
          <DropdownMenuItem onClick={onDuplicate}>
            <Copy className="me-2 size-4 text-muted-foreground" aria-hidden />
            {t("duplicate")}
          </DropdownMenuItem>
        )}
        {extraItems}
        {onDelete && (
          <>
            {(onView || onEdit || onDuplicate || extraItems) && (
              <DropdownMenuSeparator />
            )}
            <DropdownMenuItem
              variant="destructive"
              onClick={onDelete}
            >
              <Trash2 className="me-2 size-4" aria-hidden />
              {t("delete")}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
