"use client";

import { StatusBadge } from "@/components/data-table";
import { bookStatusToVariant, issueStatusToVariant, memberStatusToVariant, issueStatusLabel } from "../utils/library-mappers";

// ─── Book Status Badge ────────────────────────────────────────────────────────

interface BookStatusBadgeProps {
  status: string;
}

export function BookStatusBadge({ status }: BookStatusBadgeProps) {
  return (
    <StatusBadge
      status={bookStatusToVariant(status)}
      label={status === "active" ? "Available" : "Unavailable"}
    />
  );
}

// ─── Issue Status Badge ───────────────────────────────────────────────────────

interface IssueStatusBadgeProps {
  status: string;
}

export function IssueStatusBadge({ status }: IssueStatusBadgeProps) {
  return (
    <StatusBadge
      status={issueStatusToVariant(status)}
      label={issueStatusLabel(status)}
    />
  );
}

// ─── Member Status Badge ──────────────────────────────────────────────────────

interface MemberStatusBadgeProps {
  status: string;
}

export function MemberStatusBadge({ status }: MemberStatusBadgeProps) {
  return (
    <StatusBadge
      status={memberStatusToVariant(status)}
      label={status === "active" ? "Active" : "Inactive"}
    />
  );
}
