import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
  className?: string;
}

/**
 * DashboardLayout wraps the main scrollable content area inside the AppShell.
 * Future module pages will use this to get consistent padding and structure.
 */
export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)}>{children}</div>
  );
}
