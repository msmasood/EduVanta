"use client";

import * as React from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SubscriptionUsage } from "@/types/settings";

interface SubscriptionUsageCardProps {
  usage: SubscriptionUsage;
}

function UsageRow({
  label,
  used,
  max,
}: {
  label: string;
  used: number;
  max: number;
}) {
  const pct = max === -1 ? 0 : Math.min(100, Math.round((used / max) * 100));
  const isUnlimited = max === -1;
  const isWarning = !isUnlimited && pct >= 80;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className={`tabular-nums ${isWarning ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"}`}>
          {isUnlimited ? `${used.toLocaleString()} / Unlimited` : `${used.toLocaleString()} / ${max.toLocaleString()}`}
        </span>
      </div>
      {!isUnlimited && (
        <Progress
          value={pct}
          className={`h-2 ${isWarning ? "[&>div]:bg-amber-500" : ""}`}
        />
      )}
    </div>
  );
}

export function SubscriptionUsageCard({ usage }: SubscriptionUsageCardProps) {
  const renewalDate = new Date(usage.renewalDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card data-testid="subscription-usage-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Current Usage</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="capitalize">{usage.currentPlanName}</Badge>
            <Badge variant="outline" className="capitalize">{usage.billingCycle}</Badge>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">Renews on {renewalDate}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <UsageRow label="Students" used={usage.studentsUsed} max={usage.studentsMax} />
        <UsageRow label="Teachers" used={usage.teachersUsed} max={usage.teachersMax} />
        <UsageRow label="Admins" used={usage.adminsUsed} max={usage.adminsMax} />
        <UsageRow
          label="Storage"
          used={Math.round(usage.storageUsedMb / 1024)}
          max={Math.round(usage.storageMaxMb / 1024)}
        />
      </CardContent>
    </Card>
  );
}
