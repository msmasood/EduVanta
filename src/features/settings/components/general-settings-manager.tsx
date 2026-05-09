"use client";

import * as React from "react";
import { Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableSkeleton } from "@/components/data-table";
import { useGeneralSettings } from "@/hooks/queries/use-settings";
import { GeneralSettingsForm } from "./general-settings-form";

export function GeneralSettingsManager() {
  const query = useGeneralSettings();

  if (query.isLoading) {
    return (
      <div data-testid="general-settings-manager">
        <TableSkeleton columns={2} rows={5} />
      </div>
    );
  }

  const settings = query.data?.data;

  if (!settings) {
    return (
      <div data-testid="general-settings-manager" className="text-muted-foreground">
        Failed to load settings.
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="general-settings-manager">
      <div>
        <h1 className="text-2xl font-semibold">General Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure your school&apos;s basic information and regional preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Settings className="size-4" aria-hidden />
            School Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <GeneralSettingsForm settings={settings} />
        </CardContent>
      </Card>
    </div>
  );
}
