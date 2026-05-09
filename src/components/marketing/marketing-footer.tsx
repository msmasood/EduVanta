import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { APP_NAME } from "@/lib/constants";

export function MarketingFooter() {
  const t = useTranslations("marketing.footer");
  const locale = useLocale();
  const year = new Date().getFullYear();

  const productLinks = [
    { href: "#product", label: t("links.dashboard") },
    { href: "#pricing", label: t("links.pricing") },
    { href: "#faq", label: t("links.faq") },
  ];

  const moduleLinks = [
    { href: "#product", label: t("links.students") },
    { href: "#product", label: t("links.teachers") },
    { href: "#finance", label: t("links.fees") },
    { href: "#finance", label: t("links.finance") },
    { href: "#product", label: t("links.library") },
  ];

  const platformLinks = [
    { href: "#global", label: t("links.rtl") },
    { href: "#global", label: t("links.i18n") },
    { href: "#", label: t("links.themes") },
  ];

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link
              href="/"
              locale={locale}
              className="flex items-center gap-2 font-bold text-lg text-primary"
            >
              <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-bold">
                E
              </span>
              {APP_NAME}
            </Link>
            <p className="mt-3 text-sm text-muted-foreground max-w-xs">
              {t("description")}
            </p>
            <p className="mt-3 text-xs text-muted-foreground">{t("demoNote")}</p>
          </div>

          {/* Product */}
          <div>
            <p className="text-sm font-semibold text-foreground">{t("product")}</p>
            <ul className="mt-4 flex flex-col gap-2">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Modules */}
          <div>
            <p className="text-sm font-semibold text-foreground">{t("modules")}</p>
            <ul className="mt-4 flex flex-col gap-2">
              {moduleLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div>
            <p className="text-sm font-semibold text-foreground">{t("platform")}</p>
            <ul className="mt-4 flex flex-col gap-2">
              {platformLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {year} {APP_NAME}. {t("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
