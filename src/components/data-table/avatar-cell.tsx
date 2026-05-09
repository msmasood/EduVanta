"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getRowInitials } from "@/lib/table";
import { cn } from "@/lib/utils";

interface AvatarCellProps {
  name: string;
  subtitle?: string;
  avatarUrl?: string;
  className?: string;
}

/**
 * AvatarCell — displays an avatar (image or initials fallback) with a
 * name/subtitle pair. Intended for use in DataTable cell renderers.
 * RTL-safe: uses logical flex gap.
 */
export function AvatarCell({
  name,
  subtitle,
  avatarUrl,
  className,
}: AvatarCellProps) {
  const initials = getRowInitials(name);

  return (
    <div
      className={cn("flex items-center gap-2", className)}
      data-slot="avatar-cell"
    >
      <Avatar size="sm">
        {avatarUrl && (
          <AvatarImage src={avatarUrl} alt={name} />
        )}
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium leading-none">{name}</p>
        {subtitle && (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
