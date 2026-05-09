"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import useUIStore from "@/stores/use-ui-store";
import { AppSidebar } from "@/components/navigation/app-sidebar";
import { MobileSidebarDrawer } from "@/components/navigation/mobile-sidebar-drawer";
import { AppTopbar } from "@/components/navigation/app-topbar";
import { SkipToMain } from "./skip-to-main";

interface AppShellProps {
  children: ReactNode;
}

/**
 * AppShell — the persistent outer layout for all dashboard pages.
 *
 * Layout:
 *   ┌──────────────────────────────────────────────┐
 *   │  Sidebar (desktop)  │  Topbar (sticky)        │
 *   │                     ├─────────────────────────│
 *   │                     │  main#main-content       │
 *   └──────────────────────────────────────────────┘
 *
 * RTL: flex direction reverses so sidebar appears on the inline-end side.
 */
export function AppShell({ children }: AppShellProps) {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  return (
    <div className="flex h-dvh overflow-hidden rtl:flex-row-reverse">
      {/* ── Desktop sidebar ── */}
      <aside
        className={cn(
          "hidden lg:flex flex-col shrink-0 overflow-hidden",
          "border-e border-sidebar-border",
          "transition-[width] duration-200 ease-in-out",
          sidebarCollapsed ? "w-[72px]" : "w-[260px]",
        )}
        aria-label="Sidebar"
      >
        <AppSidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebar}
        />
      </aside>

      {/* ── Mobile drawer ── */}
      <MobileSidebarDrawer />

      {/* ── Main area (topbar + content) ── */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Accessibility: skip-to-main renders absolutely when focused */}
        <SkipToMain />

        <AppTopbar />

        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 overflow-y-auto p-4 md:p-6 focus-visible:outline-none"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
