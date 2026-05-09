"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  GraduationCap,
  User,
  Heart,
  Calculator,
  Library,
} from "lucide-react";
import { SectionHeading } from "./section-heading";

const roleIcons = {
  admin: ShieldCheck,
  teacher: GraduationCap,
  student: User,
  parent: Heart,
  accountant: Calculator,
  librarian: Library,
} as const;

const roleColors = [
  "bg-primary/10 text-primary",
  "bg-[var(--color-brand-cyan)]/10 text-[var(--color-brand-cyan)]",
  "bg-[var(--color-brand-blue)]/10 text-[var(--color-brand-blue)]",
  "bg-[var(--color-brand-red)]/10 text-[var(--color-brand-red)]",
  "bg-[var(--success)]/10 text-[var(--success)]",
  "bg-[var(--color-brand-violet)]/10 text-[var(--color-brand-violet)]",
];

export function RoleExperienceSection() {
  const t = useTranslations("marketing.roles");

  const roles = Object.keys(roleIcons) as (keyof typeof roleIcons)[];

  return (
    <section id="roles" className="py-20 sm:py-28 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={t("title")}
          subtitle={t("subtitle")}
          className="mb-14"
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((role, i) => {
            const Icon = roleIcons[role];
            return (
              <motion.div
                key={role}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6 shadow-sm"
              >
                <div
                  className={`flex size-11 items-center justify-center rounded-xl ${roleColors[i]}`}
                >
                  <Icon className="size-6" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {t(`items.${role}.name`)}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t(`items.${role}.desc`)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
