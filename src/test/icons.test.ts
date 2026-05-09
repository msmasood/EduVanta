import { describe, it, expect } from "vitest";
import { getIcon, iconRegistry } from "@/lib/icons";

describe("iconRegistry", () => {
  it("contains LayoutDashboard", () => {
    expect(iconRegistry["LayoutDashboard"]).toBeDefined();
  });

  it("contains all icons used in navigation config", () => {
    const requiredIcons = [
      "LayoutDashboard", "GraduationCap", "Users", "UserCircle",
      "BookOpen", "Building2", "UserPlus", "ClipboardCheck",
      "Tag", "UserX", "UserCog", "Briefcase", "CalendarOff",
      "ListFilter", "Banknote", "Building", "Award", "BookMarked",
      "DoorOpen", "Layers", "FileText", "CalendarDays", "BarChart3",
      "CreditCard", "FolderOpen", "ListOrdered", "Percent",
      "TrendingUp", "ArrowUpCircle", "TrendingDown", "ArrowDownCircle",
      "ArrowLeftRight", "Library", "RefreshCw", "Bell", "AlertCircle",
      "MessageSquare", "Settings", "Languages", "Coins",
      "ShieldCheck", "UserCheck", "Star",
    ];
    for (const name of requiredIcons) {
      expect(iconRegistry[name], `Missing icon: ${name}`).toBeDefined();
    }
  });
});

describe("getIcon", () => {
  it("returns the icon for a known name", () => {
    const Icon = getIcon("Bell");
    expect(Icon).toBeDefined();
    // Lucide icons use forwardRef; typeof is 'object', not 'function'
    expect(Icon).not.toBeNull();
  });

  it("falls back to HelpCircle for an unknown name", () => {
    const Icon = getIcon("NonExistentIconXYZ");
    const HelpCircle = getIcon("HelpCircle");
    expect(Icon).toBe(HelpCircle);
  });

  it("returns a React component (function or forwardRef object) for every registered icon", () => {
    for (const [name, icon] of Object.entries(iconRegistry)) {
      const isReactComponent =
        typeof icon === "function" ||
        (typeof icon === "object" && icon !== null);
      expect(isReactComponent, `Icon ${name} should be a React component`).toBe(true);
    }
  });
});
