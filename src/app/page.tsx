/**
 * Root page — the next-intl middleware intercepts all requests to /
 * and redirects to /en before this page renders.
 * This redirect is a safety-net fallback only.
 */
import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/en");
}
