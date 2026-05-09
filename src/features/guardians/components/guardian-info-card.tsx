"use client";

import { User, Briefcase, CreditCard } from "lucide-react";
import type { Guardian } from "@/types/guardian";
import { formatRelation } from "../utils/guardian-mappers";

interface GuardianInfoCardProps {
  guardian: Guardian;
}

export function GuardianInfoCard({ guardian }: GuardianInfoCardProps) {
  const rows = [
    {
      icon: User,
      label: "Full Name",
      value: `${guardian.firstName} ${guardian.lastName}`,
    },
    {
      icon: User,
      label: "Relationship",
      value: formatRelation(guardian.relation),
    },
    {
      icon: Briefcase,
      label: "Occupation",
      value: guardian.occupation ?? "—",
    },
    {
      icon: CreditCard,
      label: "National ID",
      value: guardian.nationalId ?? "—",
    },
  ];

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <h3 className="mb-4 font-semibold">Personal Information</h3>
      <dl className="space-y-3">
        {rows.map((row) => {
          const Icon = row.icon;
          return (
            <div key={row.label} className="flex items-start gap-3">
              <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
              <div>
                <dt className="text-xs text-muted-foreground">{row.label}</dt>
                <dd className="text-sm">{row.value}</dd>
              </div>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
