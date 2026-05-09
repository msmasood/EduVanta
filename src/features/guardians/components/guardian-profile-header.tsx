"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/data-table";
import type { Guardian } from "@/types/guardian";
import { guardianStatusToVariant, formatRelation } from "../utils/guardian-mappers";

interface GuardianProfileHeaderProps {
  guardian: Guardian;
  locale?: string;
}

function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function GuardianProfileHeader({ guardian, locale = "en" }: GuardianProfileHeaderProps) {
  const initials = getInitials(guardian.firstName, guardian.lastName);
  const fullName = `${guardian.firstName} ${guardian.lastName}`;
  const statusVariant = guardianStatusToVariant(guardian.status);

  return (
    <div
      className="rounded-xl border bg-card p-6 shadow-sm"
      data-testid="guardian-profile-header"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        {/* Avatar + info */}
        <div className="flex items-start gap-4">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
            {initials}
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-semibold">{fullName}</h1>
            <p className="text-sm text-muted-foreground">
              {formatRelation(guardian.relation)}
              {guardian.occupation ? ` · ${guardian.occupation}` : ""}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <StatusBadge status={statusVariant} label={guardian.status ?? "active"} />
              {guardian.isEmergencyContact && (
                <Badge variant="destructive" className="text-xs">
                  Emergency Contact
                </Badge>
              )}
              {guardian.portalAccess && (
                <Badge variant="secondary" className="text-xs">
                  Portal Access
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Edit button */}
        <Link
          href={`/${locale}/guardians/${guardian.id}/edit`}
          className="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-muted"
        >
          <Pencil className="size-4" aria-hidden />
          Edit
        </Link>
      </div>
    </div>
  );
}
