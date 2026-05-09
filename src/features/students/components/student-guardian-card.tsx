"use client";

import { Phone, Mail, User } from "lucide-react";
import type { Guardian } from "@/types/guardian";

interface StudentGuardianCardProps {
  guardian: Guardian | null | undefined;
}

export function StudentGuardianCard({ guardian }: StudentGuardianCardProps) {
  if (!guardian) {
    return (
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <h3 className="mb-4 text-base font-semibold">
          Guardian / Parent Information
        </h3>
        <p className="text-sm text-muted-foreground">No guardian linked.</p>
      </div>
    );
  }

  const rows = [
    { icon: User, label: "Name", value: `${guardian.firstName} ${guardian.lastName}` },
    { icon: User, label: "Relation", value: guardian.relation },
    { icon: User, label: "Occupation", value: guardian.occupation ?? "—" },
    { icon: Phone, label: "Phone", value: guardian.contact?.phone ?? "—" },
    { icon: Mail, label: "Email", value: guardian.contact?.email ?? "—" },
  ];

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <h3 className="mb-4 text-base font-semibold">
        Guardian / Parent Information
      </h3>
      <dl className="space-y-3">
        {rows.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-start gap-3">
            <Icon
              className="mt-0.5 size-4 shrink-0 text-muted-foreground"
              aria-hidden
            />
            <div>
              <dt className="text-xs text-muted-foreground">{label}</dt>
              <dd className="text-sm font-medium capitalize">{value}</dd>
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
}
