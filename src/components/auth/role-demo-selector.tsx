"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { BadgeCheck } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import useSchoolContextStore from "@/stores/use-school-context-store";
import { type SchoolRole } from "@/lib/constants";

type RoleKey = "superAdmin" | "admin" | "principal" | "teacher" | "student" | "parent" | "accountant" | "librarian";

const DEMO_ROLES: { role: SchoolRole; key: RoleKey }[] = [
  { role: "super-admin", key: "superAdmin" },
  { role: "admin", key: "admin" },
  { role: "principal", key: "principal" },
  { role: "teacher", key: "teacher" },
  { role: "student", key: "student" },
  { role: "parent", key: "parent" },
  { role: "accountant", key: "accountant" },
  { role: "librarian", key: "librarian" },
];

interface RoleDemoSelectorProps {
  onSelect: (email: string, password: string) => void;
}

export function RoleDemoSelector({ onSelect }: RoleDemoSelectorProps) {
  const t = useTranslations("auth.login");
  const tRoles = useTranslations("auth.roles");
  const [selected, setSelected] = React.useState<SchoolRole | null>(null);
  const setActiveRole = useSchoolContextStore((s) => s.setActiveRole);

  function handleRole(role: SchoolRole) {
    const email = `${role}@demo.eduvanta.com`;
    const password = "Demo@12345";
    setSelected(role);
    setActiveRole(role);
    onSelect(email, password);
  }

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium">{t("demoTitle")}</p>
        <p className="text-xs text-muted-foreground">{t("demoSubtitle")}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {DEMO_ROLES.map(({ role, key }) => (
          <button
            key={role}
            type="button"
            onClick={() => handleRole(role)}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "text-xs",
              selected === role &&
                "border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300"
            )}
          >
            {tRoles(key)}
          </button>
        ))}
      </div>
      {selected && (
        <div className="flex items-center gap-1.5 text-xs text-teal-600 dark:text-teal-400">
          <BadgeCheck className="size-3.5" />
          <span>{t("selectedRole")}</span>
        </div>
      )}
    </div>
  );
}
