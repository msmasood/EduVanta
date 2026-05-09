"use client";

import { Shield, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Guardian } from "@/types/guardian";

interface GuardianAccessCardProps {
  guardian: Guardian;
}

export function GuardianAccessCard({ guardian }: GuardianAccessCardProps) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <h3 className="mb-4 font-semibold">Emergency Contact & Access</h3>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Shield className="size-5 shrink-0 text-muted-foreground" aria-hidden />
          <div>
            <p className="text-xs text-muted-foreground">Emergency Contact</p>
            <p className="text-sm font-medium">
              {guardian.isEmergencyContact ? (
                <Badge variant="destructive" className="text-xs">
                  Yes — Emergency Contact
                </Badge>
              ) : (
                <span className="text-muted-foreground">Not an emergency contact</span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Globe className="size-5 shrink-0 text-muted-foreground" aria-hidden />
          <div>
            <p className="text-xs text-muted-foreground">Parent Portal Access</p>
            <p className="text-sm font-medium">
              {guardian.portalAccess ? (
                <Badge variant="secondary" className="text-xs">
                  Enabled
                </Badge>
              ) : (
                <span className="text-muted-foreground">Disabled</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
