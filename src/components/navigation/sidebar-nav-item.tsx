"use client";

import React from "react";
import { useMessages } from "next-intl";
import { cn } from "@/lib/utils";
import { getIcon } from "@/lib/icons";
import { Link, usePathname } from "@/i18n/navigation";
import type { NavigationItem } from "@/lib/navigation";

interface SidebarNavItemProps {
  item: NavigationItem;
  collapsed: boolean;
  /** Called when a nav link is clicked (used to close mobile drawer) */
  onNavClick?: () => void;
}

/** Resolve a dot-notation message key against the raw messages object. */
function resolveMessage(
  messages: Record<string, unknown>,
  key: string,
): string {
  const parts = key.split(".");
  let current: unknown = messages;
  for (const part of parts) {
    if (typeof current !== "object" || current === null) return key;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === "string" ? current : key;
}

export function SidebarNavItem({
  item,
  collapsed,
  onNavClick,
}: SidebarNavItemProps) {
  const pathname = usePathname();
  const messages = useMessages() as Record<string, unknown>;

  const icon = getIcon(item.icon);
  const label = resolveMessage(messages, item.labelKey);

  // Dashboard group items use exact match; all other routes use prefix match
  const isDashboardItem = item.href.startsWith("/dashboard");
  const isActive = isDashboardItem
    ? pathname === item.href
    : pathname === item.href ||
      (item.href !== "/" && pathname.startsWith(item.href + "/"));

  return (
    <Link
      href={item.href}
      onClick={onNavClick}
      aria-current={isActive ? "page" : undefined}
      title={collapsed ? label : undefined}
      className={cn(
        "flex items-center gap-3 rounded-md text-sm font-medium transition-colors",
        "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        isActive &&
          "bg-sidebar-accent text-sidebar-primary font-semibold",
        collapsed ? "justify-center p-2" : "px-3 py-2",
      )}
    >
      {React.createElement(icon, {
        className: "size-4 shrink-0",
        "aria-hidden": "true",
      })}
      {!collapsed && <span className="flex-1 truncate">{label}</span>}
      {collapsed && <span className="sr-only">{label}</span>}
    </Link>
  );
}
