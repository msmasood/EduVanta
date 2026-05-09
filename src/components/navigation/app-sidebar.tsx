"use client";

import { ChevronsLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";
import { navigationGroups } from "@/lib/navigation";
import { SidebarNavGroup } from "./sidebar-nav-group";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AppSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  /** Called when a nav link is clicked (closes mobile drawer) */
  onNavClick?: () => void;
}

export function AppSidebar({
  collapsed,
  onToggleCollapse,
  onNavClick,
}: AppSidebarProps) {
  const tLayout = useTranslations("layout");
  const tShell = useTranslations("shell");

  return (
    <div
      className="flex h-full flex-col bg-sidebar text-sidebar-foreground"
      data-testid="app-sidebar"
    >
      {/* ── Brand header ── */}
      <div
        className={cn(
          "flex h-16 shrink-0 items-center border-b border-sidebar-border",
          collapsed ? "justify-center px-2" : "justify-between px-4",
        )}
      >
        {collapsed ? (
          <span
            className="text-lg font-black text-sidebar-primary"
            aria-label={APP_NAME}
          >
            E
          </span>
        ) : (
          <span className="text-lg font-black tracking-tight text-sidebar-primary">
            {APP_NAME}
          </span>
        )}

        {/* Collapse toggle — desktop only */}
        <button
          onClick={onToggleCollapse}
          className={cn(
            "hidden lg:inline-flex items-center justify-center rounded-md p-1.5 transition-colors",
            "text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
            collapsed && "mt-0",
          )}
          aria-label={
            collapsed ? tLayout("expandSidebar") : tLayout("collapseSidebar")
          }
        >
          <ChevronsLeft
            className={cn(
              "size-4 transition-transform duration-200",
              collapsed && "rotate-180",
            )}
          />
        </button>
      </div>

      {/* ── Navigation ── */}
      <ScrollArea className="flex-1">
        <nav
          aria-label="Sidebar navigation"
          className={cn("py-3", collapsed ? "px-1" : "px-2")}
        >
          <div className="space-y-4">
            {navigationGroups.map((group) => (
              <SidebarNavGroup
                key={group.id}
                group={group}
                collapsed={collapsed}
                onNavClick={onNavClick}
              />
            ))}
          </div>
        </nav>
      </ScrollArea>

      {/* ── Footer / school context ── */}
      <div
        className={cn(
          "shrink-0 border-t border-sidebar-border py-3",
          collapsed ? "px-1" : "px-3",
        )}
      >
        {!collapsed && (
          <div className="rounded-md bg-sidebar-accent/60 px-3 py-2">
            <p className="truncate text-xs text-sidebar-foreground/50">
              {tShell("demoSchool")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
