"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  LayoutGrid,
  BookMarked,
  Clock,
  FileText,
  BarChart,
  ClipboardCheck,
} from "lucide-react";
import { SectionHeading } from "./section-heading";
import { FeatureCard } from "./feature-card";

const icons = [LayoutGrid, BookMarked, Clock, FileText, BarChart, ClipboardCheck];
const featureKeys = ["classes", "subjects", "timetable", "exams", "results", "attendance"] as const;

export function AcademicHighlightSection() {
  const t = useTranslations("marketing.academic");

  return (
    <section id="academic" className="py-20 sm:py-28 bg-muted/30">
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
                iconClassName="bg-[var(--color-brand-blue)]/10 text-[var(--color-brand-blue)]"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
