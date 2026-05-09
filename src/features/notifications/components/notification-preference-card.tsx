"use client";

import * as React from "react";
import { NotificationChannelToggle } from "./notification-channel-toggle";
import type { NotificationPreferenceRow } from "../utils/notification-mappers";

const CATEGORY_LABELS: Record<string, string> = {
  fees: "Fees",
  attendance: "Attendance",
  exam: "Exam",
  leave: "Leave",
  notice: "Notice",
  message: "Message",
  system: "System",
};

const AUDIENCE_LABELS: Record<string, string> = {
  admin: "Admin",
  teacher: "Teacher",
  student: "Student",
  parent: "Parent",
};

interface NotificationPreferenceCardProps {
  preference: NotificationPreferenceRow;
  onChange: (updated: NotificationPreferenceRow) => void;
}

export function NotificationPreferenceCard({ preference, onChange }: NotificationPreferenceCardProps) {
  const handleCategoryToggle = (category: string, value: boolean) => {
    onChange({
      ...preference,
      categoryToggles: { ...preference.categoryToggles, [category]: value },
    });
  };

  const handleAudienceToggle = (audience: string, value: boolean) => {
    onChange({
      ...preference,
      audienceToggles: { ...preference.audienceToggles, [audience]: value },
    });
  };

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm" data-testid="preference-card">
      <h3 className="text-base font-semibold mb-4">{preference.channelLabel}</h3>

      <div className="mb-4">
        <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-2">
          Categories
        </p>
        <div className="divide-y">
          {Object.entries(preference.categoryToggles).map(([cat, enabled]) => (
            <NotificationChannelToggle
              key={cat}
              label={CATEGORY_LABELS[cat] ?? cat}
              checked={enabled}
              onChange={(v) => handleCategoryToggle(cat, v)}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-2">
          Audience
        </p>
        <div className="divide-y">
          {Object.entries(preference.audienceToggles).map(([aud, enabled]) => (
            <NotificationChannelToggle
              key={aud}
              label={AUDIENCE_LABELS[aud] ?? aud}
              checked={enabled}
              onChange={(v) => handleAudienceToggle(aud, v)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
