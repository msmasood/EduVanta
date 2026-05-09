import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";

interface DashboardGroupLayoutProps {
  children: ReactNode;
}

/**
 * Route group layout for (dashboard).
 * Wraps all dashboard pages in the AppShell without adding a URL segment.
 */
export default function DashboardGroupLayout({
  children,
}: DashboardGroupLayoutProps) {
  return <AppShell>{children}</AppShell>;
}
