import type { ReactNode } from "react";
import "@/styles/startix-landing.scss";
import "@/styles/startix-dark.scss";
import "@/styles/startix-rtl.scss";

/**
 * Marketing route group layout.
 *
 * This is the ONLY place where Bootstrap CSS and Startix SCSS are imported.
 * Dashboard and auth routes never render this layout — zero CSS collision.
 *
 * The Tabler Icons CSS is loaded via <link> in the head for the same scoping.
 */
export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <link rel="stylesheet" href="/startix/css/tabler-icons.min.css" />
      <div className="startix-root">{children}</div>
    </>
  );
}
