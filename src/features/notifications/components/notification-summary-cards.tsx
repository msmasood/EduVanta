"use client";

import { Bell, BellOff, CheckCheck, AlertCircle } from "lucide-react";

interface SummaryCardItem {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  bg: string;
}

function SummaryCard({ label, value, icon: Icon, color, bg }: SummaryCardItem) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`rounded-lg p-2 ${bg}`}>
          <Icon className={`size-5 ${color}`} />
        </div>
        <div>
          <p className="text-2xl font-bold tabular-nums">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  );
}

interface NotificationSummaryCardsProps {
  total: number;
  unread: number;
  read: number;
  urgent: number;
}

export function NotificationSummaryCards({ total, unread, read, urgent }: NotificationSummaryCardsProps) {
  const cards: SummaryCardItem[] = [
    { label: "Total", value: total, icon: Bell, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/30" },
    { label: "Unread", value: unread, icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/30" },
    { label: "Read", value: read, icon: CheckCheck, color: "text-green-600", bg: "bg-green-50 dark:bg-green-950/30" },
    { label: "System Alerts", value: urgent, icon: BellOff, color: "text-red-600", bg: "bg-red-50 dark:bg-red-950/30" },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4" data-testid="notification-summary-cards">
      {cards.map((c) => (
        <SummaryCard key={c.label} {...c} />
      ))}
    </div>
  );
}
