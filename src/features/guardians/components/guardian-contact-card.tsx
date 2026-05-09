"use client";

import { Mail, Phone, MapPin } from "lucide-react";
import type { Guardian } from "@/types/guardian";

interface GuardianContactCardProps {
  guardian: Guardian;
}

export function GuardianContactCard({ guardian }: GuardianContactCardProps) {
  const { contact, address } = guardian;

  const rows = [
    {
      icon: Mail,
      label: "Email",
      value: contact.email ?? "—",
    },
    {
      icon: Phone,
      label: "Phone",
      value: contact.phone ?? "—",
    },
    {
      icon: Phone,
      label: "Alternate Phone",
      value: contact.alternatePhone ?? "—",
    },
    {
      icon: MapPin,
      label: "Address",
      value: [address?.line1, address?.city, address?.country].filter(Boolean).join(", ") || "—",
    },
  ];

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <h3 className="mb-4 font-semibold">Contact Information</h3>
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
