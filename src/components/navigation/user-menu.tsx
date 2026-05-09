"use client";

import { User, Settings, LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

/**
 * UserMenu — Phase 3 placeholder.
 * Real auth / profile integration will be added when auth is built.
 */
export function UserMenu() {
  const t = useTranslations("shell");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("profile")}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <User className="size-4" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem>
          <User className="mr-2 size-4" aria-hidden="true" />
          {t("profile")}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 size-4" aria-hidden="true" />
          {t("settings")}
        </DropdownMenuItem>
        <Separator />
        <DropdownMenuItem className="text-destructive">
          <LogOut className="mr-2 size-4" aria-hidden="true" />
          {t("signOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
