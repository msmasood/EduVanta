/**
 * Locale-aware navigation helpers for next-intl v4.
 * Import Link, redirect, usePathname, useRouter from here
 * instead of "next/navigation" throughout the app.
 */
import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
