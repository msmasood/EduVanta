"use client";

import { BookOpen, CheckCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MemberInfoCardProps {
  activeIssues: number;
  totalBorrowed: number;
  maxBooksAllowed: number;
  overdueCount: number;
}

export function MemberInfoCard({
  activeIssues,
  totalBorrowed,
  maxBooksAllowed,
  overdueCount,
}: MemberInfoCardProps) {
  const items = [
    {
      label: "Currently Issued",
      value: `${activeIssues} / ${maxBooksAllowed}`,
      icon: BookOpen,
      accent: activeIssues >= maxBooksAllowed ? "text-warning" : "text-primary",
    },
    {
      label: "Total Borrowed",
      value: totalBorrowed,
      icon: CheckCircle,
      accent: "text-success",
    },
    {
      label: "Overdue",
      value: overdueCount,
      icon: AlertTriangle,
      accent: overdueCount > 0 ? "text-destructive" : "text-muted-foreground",
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-3 gap-4">
          {items.map(({ label, value, icon: Icon, accent }) => (
            <div key={label} className="flex flex-col items-center text-center gap-1">
              <Icon className={`size-6 ${accent}`} aria-hidden />
              <dt className="text-xs text-muted-foreground">{label}</dt>
              <dd className="text-lg font-semibold tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
