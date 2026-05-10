import Link from "next/link";

/**
 * Locale-aware 404 page.
 * Uses Tailwind only — this renders OUTSIDE the (marketing) layout tree
 * so it never receives Bootstrap or Startix CSS.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-8xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-3">Page Not Found</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-white font-medium hover:opacity-90 transition-opacity"
        >
          Go to Homepage
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex items-center px-6 py-3 rounded-lg border border-border font-medium hover:bg-muted transition-colors"
        >
          View Dashboard
        </Link>
      </div>
    </div>
  );
}
