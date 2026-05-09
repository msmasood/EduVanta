"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight, LayoutDashboard } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function LandingHero() {
  const t = useTranslations("marketing.hero");
  const locale = useLocale();

  return (
    <section
      id="hero"
      className="relative overflow-hidden py-20 sm:py-28 lg:py-36"
    >
      {/* Gradient background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-40 start-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 end-0 w-[400px] h-[400px] rounded-full bg-[var(--color-brand-cyan)]/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge
              variant="outline"
              className="mb-6 inline-flex gap-1.5 px-3 py-1 text-xs font-medium border-primary/30 text-primary"
            >
              {t("eyebrow")}
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            {t("title")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg leading-relaxed text-muted-foreground"
          >
            {t("subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <Link
              href="/register"
              locale={locale}
              className={cn(buttonVariants({ size: "lg" }), "gap-2")}
            >
              {t("primaryCta")}
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/dashboard"
              locale={locale}
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "gap-2")}
            >
              <LayoutDashboard className="size-4" />
              {t("secondaryCta")}
            </Link>
          </motion.div>
        </div>

        {/* Dashboard mockup browser frame */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mx-auto mt-16 max-w-5xl"
        >
          <div className="overflow-hidden rounded-2xl border border-border shadow-2xl bg-card">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
              <div className="flex gap-1.5">
                <span className="size-3 rounded-full bg-red-400" />
                <span className="size-3 rounded-full bg-yellow-400" />
                <span className="size-3 rounded-full bg-green-400" />
              </div>
              <div className="mx-auto flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
                <span className="size-3 rounded-full bg-primary" />
                eduvanta.app/dashboard
              </div>
            </div>
            {/* Mock dashboard content */}
            <div className="p-6 grid grid-cols-3 gap-4">
              {[
                { label: "Total Students", val: "2,840", color: "bg-primary" },
                { label: "Active Teachers", val: "142", color: "bg-[var(--color-brand-cyan)]" },
                { label: "Fees Collected", val: "$84,200", color: "bg-[var(--success)]" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-border bg-background p-4"
                >
                  <div className={`mb-2 size-8 rounded-md ${stat.color} opacity-80`} />
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-xl font-bold text-foreground">{stat.val}</p>
                </div>
              ))}
              <div className="col-span-3 rounded-xl border border-border bg-background p-4">
                <p className="mb-3 text-xs font-medium text-muted-foreground">Attendance Overview</p>
                <div className="flex h-20 items-end gap-2">
                  {[65, 80, 72, 90, 85, 78, 88].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-sm bg-primary/60"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
