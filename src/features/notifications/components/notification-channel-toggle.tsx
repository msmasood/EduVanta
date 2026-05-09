"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface NotificationChannelToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}

export function NotificationChannelToggle({
  label,
  checked,
  onChange,
  description,
}: NotificationChannelToggleProps) {
  return (
    <div className="flex items-center justify-between gap-3 py-2" data-testid="channel-toggle">
      <div>
        <Label className="text-sm font-medium">{label}</Label>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
