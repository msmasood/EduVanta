"use client";

import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { getDirection } from "@/lib/routes";
import useUIStore from "@/stores/use-ui-store";
import { AppSidebar } from "./app-sidebar";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { APP_NAME } from "@/lib/constants";

export function MobileSidebarDrawer() {
  const { mobileSidebarOpen, setMobileSidebarOpen } = useUIStore();
  const locale = useLocale();
  const tLayout = useTranslations("layout");

  const direction = getDirection(locale);
  // In RTL layouts the drawer slides in from the right
  const side = direction === "rtl" ? "right" : "left";

  function handleNavClick() {
    setMobileSidebarOpen(false);
  }

  return (
    <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
      <SheetContent
        side={side}
        showCloseButton={false}
        className={cn(
          "w-[260px] p-0",
          // Prevent the default Sheet max-width override
          "data-[side=left]:sm:max-w-[260px] data-[side=right]:sm:max-w-[260px]",
        )}
      >
        {/* Accessible title for screen readers */}
        <SheetTitle className="sr-only">{APP_NAME}</SheetTitle>
        <div
          aria-label={tLayout("closeMenu")}
          className="flex h-full flex-col"
        >
          <AppSidebar
            collapsed={false}
            onToggleCollapse={() => setMobileSidebarOpen(false)}
            onNavClick={handleNavClick}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
