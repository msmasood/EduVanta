"use client";

import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { NotificationPreferenceCard } from "./notification-preference-card";
import { buildDefaultPreferenceRows, type NotificationPreferenceRow } from "../utils/notification-mappers";

export function NotificationAlertsManager() {
  const [preferences, setPreferences] = React.useState<NotificationPreferenceRow[]>(
    buildDefaultPreferenceRows
  );
  const [isSaving, setIsSaving] = React.useState(false);

  const handleChange = (updated: NotificationPreferenceRow) => {
    setPreferences((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    toast.success("Notification preferences saved. (Mock)");
    setIsSaving(false);
  };

  return (
    <div className="space-y-6" data-testid="notification-alerts-manager">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Notification Alerts & Preferences</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure which notification channels are active for each category and audience.
          </p>
        </div>
        <Button
          onClick={handleSave}
          size="sm"
          disabled={isSaving}
          data-testid="save-preferences-btn"
        >
          {isSaving ? "Saving…" : "Save Preferences"}
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4" data-testid="preference-grid">
        {preferences.map((pref) => (
          <NotificationPreferenceCard key={pref.id} preference={pref} onChange={handleChange} />
        ))}
      </div>
    </div>
  );
}
