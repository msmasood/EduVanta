"use client";

import * as React from "react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { LocaleSwitcher } from "@/components/common/locale-switcher";
import { AuthBrandPanel } from "@/components/auth/auth-brand-panel";

interface AuthLayoutShellProps {
  children: React.ReactNode;
}

export function AuthLayoutShell({ children }: AuthLayoutShellProps) {
  const t = useTranslations("auth.common");

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left brand panel — hidden on mobile */}
      <AuthBrandPanel />

      {/* Right form panel */}
      <div className="flex flex-col">
        {/* Top header bar */}
        <header className="flex items-center justify-between border-b border-border/50 px-6 py-3">
          {/* Brand link (visible on mobile where panel is hidden) */}
          <div className="lg:hidden">
            <Link
              href="/"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "gap-2 font-semibold"
              )}
            >
              <span className="flex size-6 items-center justify-center rounded-lg bg-teal-600 text-xs font-bold text-white">
                E
              </span>
              {APP_NAME}
            </Link>
          </div>

          {/* Back to home (desktop) */}
          <div className="hidden lg:flex">
            <Link
              href="/"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "gap-1"
              )}
            >
              ← {t("backToHome")}
            </Link>
          </div>

          {/* Controls */}
          <div className="ms-auto flex items-center gap-2">
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
        </header>

        {/* Main form area */}
        <main className="flex flex-1 items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">{children}</div>
        </main>
      </div>
    </div>
  );
}
