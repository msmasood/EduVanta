"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Users,
  GraduationCap,
  UserCheck,
  ClipboardList,
  FileText,
  DollarSign,
  TrendingUp,
  Briefcase,
  BookOpen,
  Bell,
  Calendar,
  MessageSquare,
  Settings,
} from "lucide-react";
import { SectionHeading } from "./section-heading";
import { FeatureCard } from "./feature-card";

export function ProductModuleGrid() {
  const t = useTranslations("marketing.modules");

  const modules = [
    { key: "students", icon: Users },
    { key: "teachers", icon: GraduationCap },
    { key: "guardians", icon: UserCheck },
    { key: "attendance", icon: ClipboardList },
    { key: "exams", icon: FileText },
    { key: "fees", icon: DollarSign },
    { key: "finance", icon: TrendingUp },
    { key: "hrm", icon: Briefcase },
    { key: "library", icon: BookOpen },
    { key: "notices", icon: Bell },
    { key: "events", icon: Calendar },
    { key: "messages", icon: MessageSquare },
    { key: "settings", icon: Settings },
  ] as const;

  return (
    <section id="product" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={t("title")}
          subtitle={t("subtitle")}
          className="mb-14"
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {modules.map((mod, i) => (
            <motion.div
              key={mod.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
            >
              <FeatureCard
                icon={mod.icon}
                title={t(`items.${mod.key}`)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
