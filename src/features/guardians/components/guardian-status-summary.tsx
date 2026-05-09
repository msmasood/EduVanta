"use client";

import { Users, UserCheck, Phone, Globe } from "lucide-react";
import type { GuardianStatusSummary } from "../utils/guardian-mappers";

interface GuardianStatusCardsProps {
  summary: GuardianStatusSummary;
}

export function GuardianStatusCards({ summary }: GuardianStatusCardsProps) {
  const cards = [
    {
      label: "Total Guardians",
      value: summary.total,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      label: "Active",
      value: summary.active,
      icon: UserCheck,
      color: "text-green-600",
      bg: "bg-green-50 dark:bg-green-950/30",
    },
    {
      label: "Emergency Contacts",
      value: summary.emergencyContacts,
      icon: Phone,
      color: "text-red-600",
      bg: "bg-red-50 dark:bg-red-950/30",
    },
    {
      label: "Portal Access",
      value: summary.portalAccess,
      icon: Globe,
      color: "text-purple-600",
      bg: "bg-purple-50 dark:bg-purple-950/30",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="rounded-xl border bg-card p-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className={`rounded-lg p-2 ${card.bg}`}>
                <Icon className={`size-5 ${card.color}`} aria-hidden />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{card.label}</p>
                <p className="text-2xl font-semibold tabular-nums">{card.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
