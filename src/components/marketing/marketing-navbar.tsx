"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Menu, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { LocaleSwitcher } from "@/components/common/locale-switcher";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";

export function MarketingNavbar() {
  const t = useTranslations("marketing.nav");
  const locale = useLocale();
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: `#product`, label: t("product") },
    { href: `#roles`, label: t("roles") },
    { href: `#pricing`, label: t("pricing") },
    { href: `#faq`, label: t("faq") },
  ];

  return (
    <header
      data-testid="marketing-navbar"
      className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur-sm"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          href="/"
          locale={locale}
          className="flex items-center gap-2 font-bold text-xl text-primary"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
            E
          </span>
          {APP_NAME}
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <LocaleSwitcher />
          <Link
            href="/login"
            locale={locale}
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            {t("login")}
          </Link>
          <Link
            href="/register"
            locale={locale}
            className={cn(buttonVariants({ size: "sm" }))}
          >
            {t("getStarted")}
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen(!open)}
            className="rounded-md p-2 text-muted-foreground hover:text-foreground"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            <LocaleSwitcher />
            <Link
              href="/login"
              locale={locale}
              onClick={() => setOpen(false)}
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "justify-start")}
            >
              {t("login")}
            </Link>
            <Link
              href="/register"
              locale={locale}
              onClick={() => setOpen(false)}
              className={cn(buttonVariants({ size: "sm" }))}
            >
              {t("getStarted")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}