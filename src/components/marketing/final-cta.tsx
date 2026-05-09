"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight, LayoutDashboard } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FinalCta() {
  const t = useTranslations("marketing.cta");
  const locale = useLocale();

  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-primary px-8 py-16 text-center shadow-xl sm:px-16"
        >
          {/* Background glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-0 overflow-hidden"
          >
            <div className="absolute -start-20 -top-20 size-80 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -end-20 size-80 rounded-full bg-white/10 blur-3xl" />
          </div>

          <h2 className="relative text-3xl font-extrabold tracking-tight text-primary-foreground sm:text-4xl">
            {t("title")}
          </h2>
          <p className="relative mt-4 text-lg text-primary-foreground/80">
            {t("subtitle")}
          </p>
          <div className="relative mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/dashboard"
              locale={locale}
              className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "gap-2 bg-white text-primary hover:bg-white/90")}
            >
              <LayoutDashboard className="size-4" />
              {t("primary")}
            </Link>
            <Link
              href="/register"
              locale={locale}
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "gap-2 border-white/40 text-primary-foreground hover:bg-white/10 hover:text-primary-foreground")}
            >
              {t("secondary")}
              <ArrowRight className="size-4 rtl:rotate-180" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
