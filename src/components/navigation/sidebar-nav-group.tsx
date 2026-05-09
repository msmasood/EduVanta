"use client";

import { useMessages } from "next-intl";
import { cn } from "@/lib/utils";
import { SidebarNavItem } from "./sidebar-nav-item";
import type { NavigationGroup } from "@/lib/navigation";

interface SidebarNavGroupProps {
  group: NavigationGroup;
  collapsed: boolean;
  onNavClick?: () => void;
}

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

export function SidebarNavGroup({
  group,
  collapsed,
  onNavClick,
}: SidebarNavGroupProps) {
  const messages = useMessages() as Record<string, unknown>;
  const groupLabel = resolveMessage(messages, group.labelKey);

  return (
    <div className="space-y-0.5">
      {/* Group heading — visible when expanded */}
      {!collapsed && (
        <p
          className={cn(
            "px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-widest",
            "text-sidebar-foreground/40 select-none",
          )}
        >
          {groupLabel}
        </p>
      )}
      {/* Collapsed divider between groups */}
      {collapsed && (
        <div className="my-1.5 h-px bg-sidebar-border/40" aria-hidden="true" />
      )}
      {group.items.map((item) => (
        <SidebarNavItem
          key={item.id}
          item={item}
          collapsed={collapsed}
          onNavClick={onNavClick}
        />
      ))}
    </div>
  );
}
