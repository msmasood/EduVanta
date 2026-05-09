"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { moduleLabel } from "../utils/settings-mappers";
import type { ModulePermission, PermissionAction, PermissionModule } from "@/types/settings";

const ALL_MODULES: PermissionModule[] = [
  "students", "teachers", "guardians", "employees", "academic",
  "exams", "fees", "finance", "library", "communication",
  "notifications", "certificates", "settings", "hrm", "attendance", "reports",
];

const ALL_ACTIONS: PermissionAction[] = ["view", "create", "edit", "delete"];

interface RolePermissionMatrixProps {
  permissions: ModulePermission[];
  readOnly?: boolean;
  onChange?: (permissions: ModulePermission[]) => void;
}

export function RolePermissionMatrix({
  permissions,
  readOnly = true,
  onChange,
}: RolePermissionMatrixProps) {
  const permMap = React.useMemo(() => {
    const map = new Map<PermissionModule, Set<PermissionAction>>();
    for (const p of permissions) {
      map.set(p.module, new Set(p.actions));
    }
    return map;
  }, [permissions]);

  const hasAction = (module: PermissionModule, action: PermissionAction): boolean => {
    return permMap.get(module)?.has(action) ?? false;
  };

  const toggleAction = (module: PermissionModule, action: PermissionAction) => {
    if (readOnly || !onChange) return;

    const current = permMap.get(module) ? new Set(permMap.get(module)) : new Set<PermissionAction>();

    if (current.has(action)) {
      current.delete(action);
    } else {
      current.add(action);
    }

    const newPermissions: ModulePermission[] = ALL_MODULES.map((mod) => {
      const actions = mod === module ? current : (permMap.get(mod) ?? new Set<PermissionAction>());
      return { module: mod, actions: Array.from(actions) as PermissionAction[] };
    }).filter((p) => p.actions.length > 0);

    onChange(newPermissions);
  };

  const moduleHasAnyPermission = (module: PermissionModule): boolean => {
    return (permMap.get(module)?.size ?? 0) > 0;
  };

  return (
    <div className="overflow-x-auto" data-testid="role-permission-matrix">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b bg-muted/40">
            <th className="py-2 px-3 text-left font-medium w-40">Module</th>
            {ALL_ACTIONS.map((action) => (
              <th key={action} className="py-2 px-3 text-center font-medium capitalize w-20">
                {action}
              </th>
            ))}
            <th className="py-2 px-3 text-center font-medium w-24">Access</th>
          </tr>
        </thead>
        <tbody>
          {ALL_MODULES.map((module, i) => (
            <tr
              key={module}
              className={`border-b transition-colors ${i % 2 === 0 ? "bg-background" : "bg-muted/20"} ${!readOnly ? "hover:bg-muted/40" : ""}`}
            >
              <td className="py-2 px-3 font-medium">{moduleLabel(module)}</td>
              {ALL_ACTIONS.map((action) => (
                <td key={action} className="py-2 px-3 text-center">
                  {readOnly ? (
                    hasAction(module, action) ? (
                      <Check className="size-4 mx-auto text-emerald-600" aria-label="Allowed" />
                    ) : (
                      <span className="text-muted-foreground/40">—</span>
                    )
                  ) : (
                    <Checkbox
                      checked={hasAction(module, action)}
                      onCheckedChange={() => toggleAction(module, action)}
                      aria-label={`${action} ${module}`}
                    />
                  )}
                </td>
              ))}
              <td className="py-2 px-3 text-center">
                {moduleHasAnyPermission(module) ? (
                  <Badge variant="secondary" className="text-xs">Active</Badge>
                ) : (
                  <Badge variant="outline" className="text-xs text-muted-foreground">None</Badge>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
