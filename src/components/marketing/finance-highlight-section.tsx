"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  BarChart2,
  Coins,
} from "lucide-react";
import { SectionHeading } from "./section-heading";
import { FeatureCard } from "./feature-card";

const icons = [DollarSign, TrendingUp, TrendingDown, CreditCard, BarChart2, Coins];
const featureKeys = ["fees", "income", "expenses", "payroll", "transactions", "currency"] as const;

export function FinanceHighlightSection() {
  const t = useTranslations("marketing.finance");

  return (
    <section id="finance" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={t("title")}
          subtitle={t("subtitle")}
          className="mb-14"
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {featureKeys.map((key, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
            >
              <FeatureCard
                icon={icons[i]}
                title={t(`items.${key}`)}
                iconClassName="bg-[var(--success)]/10 text-[var(--success)]"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
