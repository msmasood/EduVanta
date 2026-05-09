"use client";

import * as React from "react";
import { Check, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/currency";
import type { SubscriptionPlan, BillingCycle } from "@/types/settings";

interface SubscriptionPlanCardProps {
  plan: SubscriptionPlan;
  billingCycle: BillingCycle;
  isCurrentPlan: boolean;
  onSelect: (planId: string) => void;
}

export function SubscriptionPlanCard({
  plan,
  billingCycle,
  isCurrentPlan,
  onSelect,
}: SubscriptionPlanCardProps) {
  const price = billingCycle === "annual" ? plan.price.annual : plan.price.monthly;
  const isFree = plan.tier === "free";
  const isEnterprise = plan.tier === "enterprise";

  return (
    <Card
      className={`relative flex flex-col transition-all ${isCurrentPlan ? "ring-2 ring-primary" : ""} ${plan.isPopular ? "border-primary/50 shadow-md" : ""}`}
      data-testid="subscription-plan-card"
    >
      {plan.isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="gap-1 px-3 py-0.5">
            <Zap className="size-3" aria-hidden />
            Most Popular
          </Badge>
        </div>
      )}
      {isCurrentPlan && (
        <div className="absolute -top-3 right-4">
          <Badge variant="secondary" className="px-3 py-0.5">Current Plan</Badge>
        </div>
      )}

      <CardHeader className="pt-6">
        <CardTitle className="text-lg">{plan.name}</CardTitle>
        <div className="mt-2">
          {isFree || isEnterprise ? (
            <p className="text-2xl font-bold">
              {isEnterprise ? "Custom" : "Free"}
            </p>
          ) : (
            <div>
              <span className="text-3xl font-bold">
                {formatCurrency(price, plan.price.currency)}
              </span>
              <span className="text-sm text-muted-foreground ml-1">
                /{billingCycle === "annual" ? "year" : "month"}
              </span>
              {billingCycle === "annual" && !isFree && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                  Save {formatCurrency(plan.price.monthly * 12 - plan.price.annual, plan.price.currency)}/year
                </p>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex flex-col flex-1 gap-4">
        {/* Limits */}
        <div className="space-y-1 text-sm text-muted-foreground">
          <p>{plan.maxStudents === -1 ? "Unlimited" : `Up to ${plan.maxStudents.toLocaleString()}`} students</p>
          <p>{plan.maxTeachers === -1 ? "Unlimited" : `Up to ${plan.maxTeachers.toLocaleString()}`} teachers</p>
          <p>{plan.maxAdmins === -1 ? "Unlimited" : `Up to ${plan.maxAdmins}`} admin{plan.maxAdmins !== 1 ? "s" : ""}</p>
        </div>

        {/* Features */}
        <ul className="space-y-1.5 flex-1">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm">
              <Check className="size-3.5 text-emerald-600 flex-shrink-0" aria-hidden />
              <span className="capitalize">{feature.replace(/-/g, " ")}</span>
            </li>
          ))}
        </ul>

        <Button
          variant={isCurrentPlan ? "secondary" : plan.isPopular ? "default" : "outline"}
          className="w-full mt-2"
          disabled={isCurrentPlan}
          onClick={() => onSelect(plan.id)}
        >
          {isCurrentPlan ? "Current Plan" : isEnterprise ? "Contact Sales" : "Upgrade"}
        </Button>
      </CardContent>
    </Card>
  );
}
