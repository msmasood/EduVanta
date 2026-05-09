"use client";

import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import useUIStore from "@/stores/use-ui-store";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { LocaleSwitcher } from "@/components/common/locale-switcher";
import { CurrencySwitcher } from "@/components/common/currency-switcher";
import { NotificationDropdown } from "./notification-dropdown";
import { UserMenu } from "./user-menu";
import { QuickSearch } from "./quick-search";
import { Breadcrumbs } from "./breadcrumbs";

export function AppTopbar() {
  const { setMobileSidebarOpen } = useUIStore();
  const tLayout = useTranslations("layout");

  return (
    <header
      className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80"
      data-testid="app-topbar"
    >
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileSidebarOpen(true)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
        aria-label={tLayout("openMenu")}
      >
        <Menu className="size-4" aria-hidden="true" />
      </button>

      {/* Breadcrumbs — desktop */}
      <div className="hidden flex-1 lg:block">
        <Breadcrumbs />
      </div>

      {/* Spacer on mobile */}
      <div className="flex-1 lg:hidden" />

      {/* Right-side controls */}
      <div className="flex items-center gap-1">
        {/* Search — hide on small mobile */}
        <div className="hidden sm:block">
          <QuickSearch />
        </div>

        {/* Theme toggle */}
        <ThemeToggle />

        {/* Locale + currency — hidden on mobile to save space */}
        <div className="hidden md:flex items-center gap-1">
          <LocaleSwitcher />
          <CurrencySwitcher />
        </div>

        {/* Notifications */}
        <NotificationDropdown />

        {/* User menu */}
        <UserMenu />
      </div>
    </header>
  );
}
