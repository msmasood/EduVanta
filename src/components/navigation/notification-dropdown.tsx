"use client";

import { Bell } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * NotificationDropdown — Phase 3 placeholder.
 * Real notification integration will be added in a later phase.
 */
export function NotificationDropdown() {
  const t = useTranslations("shell");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("notifications")}
        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Bell className="size-4" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuItem disabled className="text-muted-foreground">
          {t("noNotifications")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
