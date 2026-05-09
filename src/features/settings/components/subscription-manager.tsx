"use client";

import * as React from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableSkeleton } from "@/components/data-table";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  useSubscriptionPlans,
  useSubscriptionUsage,
  useBillingHistory,
} from "@/hooks/queries/use-settings";
import { mapBillingToRows } from "../utils/settings-mappers";
import { SubscriptionPlanCard } from "./subscription-plan-card";
import { SubscriptionUsageCard } from "./subscription-usage-card";
import { SubscriptionBillingHistory } from "./subscription-billing-history";
import type { BillingCycle } from "@/types/settings";

export function SubscriptionManager() {
  const plansQuery = useSubscriptionPlans();
  const usageQuery = useSubscriptionUsage();
  const billingQuery = useBillingHistory();

  const [billingCycle, setBillingCycle] = React.useState<BillingCycle>("annual");

  const plans = plansQuery.data?.data ?? [];
  const usage = usageQuery.data?.data;
  const rawBilling = billingQuery.data?.data ?? [];
  const billingRows = React.useMemo(() => mapBillingToRows(rawBilling), [rawBilling]);

  const isLoading = plansQuery.isLoading || usageQuery.isLoading || billingQuery.isLoading;

  if (isLoading) {
    return (
      <div data-testid="subscription-manager">
        <TableSkeleton columns={3} rows={4} />
      </div>
    );
  }

  const handleSelectPlan = (planId: string) => {
    const plan = plans.find((p) => p.id === planId);
    if (plan?.tier === "enterprise") {
      toast.info("Contact sales@eduvanta.edu for Enterprise pricing.");
    } else {
      toast.success(`Upgrade to ${plan?.name} plan initiated. (Mock)`);
    }
  };

  return (
    <div className="space-y-8" data-testid="subscription-manager">
      <div>
        <h1 className="text-2xl font-semibold">Subscription</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your subscription plan and billing.
        </p>
      </div>

      {/* Usage */}
      {usage && <SubscriptionUsageCard usage={usage} />}

      {/* Plan selection */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base">Choose Your Plan</CardTitle>
            <div className="flex items-center gap-3" data-testid="billing-cycle-toggle">
              <Label htmlFor="billing-toggle" className="text-sm">Monthly</Label>
              <Switch
                id="billing-toggle"
                checked={billingCycle === "annual"}
                onCheckedChange={(v) => setBillingCycle(v ? "annual" : "monthly")}
              />
              <Label htmlFor="billing-toggle" className="text-sm">
                Annual
                <span className="ml-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  Save 15%
                </span>
              </Label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5"
            data-testid="subscription-plan-cards"
          >
            {plans.map((plan) => (
              <SubscriptionPlanCard
                key={plan.id}
                plan={plan}
                billingCycle={billingCycle}
                isCurrentPlan={plan.id === usage?.currentPlanId}
                onSelect={handleSelectPlan}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Billing history */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Billing History</CardTitle>
        </CardHeader>
        <CardContent>
          <Separator className="mb-4" />
          <SubscriptionBillingHistory rows={billingRows} />
        </CardContent>
      </Card>
    </div>
  );
}
