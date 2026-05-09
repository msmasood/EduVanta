"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Bell,
  CalendarDays,
  MessageCircle,
  Megaphone,
} from "lucide-react";
import { SectionHeading } from "./section-heading";
import { FeatureCard } from "./feature-card";

const icons = [Megaphone, CalendarDays, MessageCircle, Bell];
const featureKeys = ["notices", "events", "messages", "notifications"] as const;

export function CommunicationHighlightSection() {
  const t = useTranslations("marketing.communication");

  return (
    <section id="communication" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={t("title")}
          subtitle={t("subtitle")}
          className="mb-14"
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {featureKeys.map((key, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.07 }}
            >
              <FeatureCard
                icon={icons[i]}
                title={t(`items.${key}`)}
                iconClassName="bg-[var(--color-brand-violet)]/10 text-[var(--color-brand-violet)]"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
