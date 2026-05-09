"use client";

import { ArrowLeft, BookOpen, Calendar, Hash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MemberStatusBadge } from "./library-status-badges";

interface MemberProfileHeaderProps {
  id: string;
  name: string;
  initials: string;
  membershipNumber: string;
  memberTypeLabel: string;
  joinedDate: string;
  status: string;
  backHref: string;
}

export function MemberProfileHeader({
  name,
  initials,
  membershipNumber,
  memberTypeLabel,
  joinedDate,
  status,
  backHref,
}: MemberProfileHeaderProps) {
  return (
    <div
      className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
      data-testid="member-profile-header"
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div
          className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xl font-bold select-none"
          aria-hidden
        >
          {initials}
        </div>

        {/* Info */}
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold leading-tight">{name}</h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Hash className="size-3.5" aria-hidden />
              {membershipNumber}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="size-3.5" aria-hidden />
              {memberTypeLabel}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="size-3.5" aria-hidden />
              {joinedDate}
            </span>
          </div>
          <div className="pt-0.5">
            <MemberStatusBadge status={status} />
          </div>
        </div>
      </div>

      {/* Back button */}
      <Button variant="outline" size="sm" onClick={() => { window.location.href = backHref; }}>
        <ArrowLeft className="me-1.5 size-4" aria-hidden />
        Back to Members
      </Button>
    </div>
  );
}
