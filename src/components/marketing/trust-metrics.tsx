"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export function TrustMetrics() {
  const t = useTranslations("marketing.metrics");

  const metrics = [
    { value: t("modules"), label: t("modulesLabel"), color: "text-primary" },
    { value: t("dashboards"), label: t("dashboardsLabel"), color: "text-[var(--color-brand-cyan)]" },
    { value: t("languages"), label: t("languagesLabel"), color: "text-[var(--color-brand-violet)]" },
    { value: t("currencies"), label: t("currenciesLabel"), color: "text-[var(--success)]" },
  ];

  return (
    <section className="border-y border-border bg-muted/30 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {metrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="text-center"
            >
              <p className={`text-4xl font-extrabold ${metric.color}`}>
                {metric.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{metric.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
