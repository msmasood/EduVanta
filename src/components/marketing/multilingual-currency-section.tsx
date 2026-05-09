"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Globe, ArrowLeftRight, Coins } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import useCurrencyStore from "@/stores/use-currency-store";
import { SectionHeading } from "./section-heading";

export function MultilingualCurrencySection() {
  const t = useTranslations("marketing.global");
  const locale = useLocale();
  const { activeCurrency } = useCurrencyStore();

  const sampleAmounts = [
    { amount: 49, label: "Starter Plan" },
    { amount: 129, label: "Growth Plan" },
    { amount: 299, label: "Institution Plan" },
  ];

  const features = [
    {
      icon: Globe,
      title: t("rtlReady"),
      desc: t("rtlDesc"),
    },
    {
      icon: Coins,
      title: t("multiCurrency"),
      desc: t("currencyDesc"),
    },
    {
      icon: ArrowLeftRight,
      title: t("i18nReady"),
      desc: t("i18nDesc"),
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={t("title")}
          subtitle={t("subtitle")}
          className="mb-14"
        />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Feature list */}
          <div className="flex flex-col gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {feature.title}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {feature.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Currency live demo */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-xl border border-border bg-card p-6 shadow-sm"
          >
            <p className="mb-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Live Currency Display
            </p>
            <p className="mb-4 text-sm text-muted-foreground">
              Showing prices in{" "}
              <strong className="text-foreground">{activeCurrency}</strong> for
              locale <strong className="text-foreground">{locale}</strong>
            </p>
            <div className="flex flex-col gap-3">
              {sampleAmounts.map(({ amount, label }) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-lg border border-border bg-background p-3"
                >
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <span className="font-semibold text-foreground">
                    {formatCurrency(amount, activeCurrency, locale)}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Switch locale or currency using the controls in the navbar.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
