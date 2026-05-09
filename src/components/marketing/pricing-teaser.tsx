"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";
import useCurrencyStore from "@/stores/use-currency-store";
import { SectionHeading } from "./section-heading";

type PlanKey = "starter" | "growth" | "institution";

const plans: { key: PlanKey; popular?: boolean }[] = [
  { key: "starter" },
  { key: "growth", popular: true },
  { key: "institution" },
];

export function PricingTeaser() {
  const t = useTranslations("marketing.pricing");
  const locale = useLocale();
  const { activeCurrency } = useCurrencyStore();

  return (
    <section id="pricing" className="py-20 sm:py-28 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={t("title")}
          subtitle={t("subtitle")}
          className="mb-14"
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {plans.map((plan, i) => {
            const price: number = t.raw(`plans.${plan.key}.priceMonthly`) as number;
            const features: string[] = t.raw(`plans.${plan.key}.features`) as string[];

            return (
              <motion.div
                key={plan.key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={`relative flex flex-col rounded-2xl border bg-card p-6 shadow-sm ${
                  plan.popular
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border"
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 start-1/2 -translate-x-1/2 whitespace-nowrap">
                    {t("mostPopular")}
                  </Badge>
                )}
                <p className="text-lg font-bold text-foreground">
                  {t(`plans.${plan.key}.name`)}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t(`plans.${plan.key}.desc`)}
                </p>
                <p className="mt-6 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-foreground">
                    {formatCurrency(price, activeCurrency, locale)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {t("month")}
                  </span>
                </p>
                <ul className="mt-6 flex flex-col gap-2 flex-1">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  locale={locale}
                  className={cn(buttonVariants({ variant: plan.popular ? "default" : "outline" }), "mt-8")}
                >
                  {t("cta")}
                </Link>
              </motion.div>
            );
          })}
        </div>
        <p className="mt-8 text-center text-sm text-muted-foreground">
          {t("note")}
        </p>
      </div>
    </section>
  );
}
