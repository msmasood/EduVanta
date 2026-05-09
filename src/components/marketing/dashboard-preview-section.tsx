"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./section-heading";

const dashboardColors = [
  "from-primary/20 to-primary/5 border-primary/20",
  "from-[var(--color-brand-cyan)]/20 to-[var(--color-brand-cyan)]/5 border-[var(--color-brand-cyan)]/20",
  "from-[var(--color-brand-blue)]/20 to-[var(--color-brand-blue)]/5 border-[var(--color-brand-blue)]/20",
  "from-[var(--color-brand-red)]/20 to-[var(--color-brand-red)]/5 border-[var(--color-brand-red)]/20",
  "from-[var(--color-brand-violet)]/20 to-[var(--color-brand-violet)]/5 border-[var(--color-brand-violet)]/20",
  "from-[var(--success)]/20 to-[var(--success)]/5 border-[var(--success)]/20",
];

const dashboardRoutes: Record<string, string> = {
  school: "/dashboard",
  student: "/dashboard/student",
  teacher: "/dashboard/teacher",
  parent: "/dashboard/parent",
  lms: "/dashboard/lms",
  university: "/dashboard/university",
};

export function DashboardPreviewSection() {
  const t = useTranslations("marketing.dashboardPreview");
  const locale = useLocale();
  const items = Object.keys(dashboardRoutes);

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={t("title")}
          subtitle={t("subtitle")}
          className="mb-14"
        />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((key, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
            >
              <Link
                href={dashboardRoutes[key]}
                locale={locale}
                className={`group flex flex-col justify-between gap-6 rounded-xl border bg-gradient-to-br p-6 transition-shadow hover:shadow-md ${dashboardColors[i]}`}
              >
                {/* Mini mock screen */}
                <div className="overflow-hidden rounded-lg border border-border bg-background/70 p-3">
                  <div className="mb-2 flex gap-1">
                    <span className="h-1.5 w-8 rounded-full bg-current opacity-30" />
                    <span className="h-1.5 w-5 rounded-full bg-current opacity-20" />
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[40, 60, 45].map((h, j) => (
                      <div
                        key={j}
                        className="rounded-sm bg-current opacity-20"
                        style={{ height: `${h}px` }}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-foreground">
                    {t(`items.${key}`)}
                  </p>
                  <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 rtl:rotate-180" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/dashboard"
            locale={locale}
            className={cn(buttonVariants({ size: "lg" }), "gap-2")}
          >
            {t("title")}
            <ArrowRight className="size-4 rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </section>
  );
}
