import * as React from "react";

import { AuthLayoutShell } from "@/components/auth/auth-layout-shell";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return <AuthLayoutShell>{children}</AuthLayoutShell>;
}
