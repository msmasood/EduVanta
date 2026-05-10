"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, useRouter, usePathname } from "@/i18n/navigation";
import Image from "next/image";
import useSticky from "./useSticky";

const navHrefs = ["/", "/about", "/services", "/pricing", "/blog", "/contact"] as const;
const navKeys = ["home", "about", "services", "pricing", "blog", "contact"] as const;

const locales = [
  { code: "en", label: "EN" },
  { code: "ar", label: "عر" },
  { code: "ur", label: "اردو" },
] as const;

export default function MarketingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { sticky } = useSticky();
  const t = useTranslations("landing.nav");
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(locale: string) {
    setLangOpen(false);
    setMobileOpen(false);
    router.replace(pathname, { locale });
  }

  const currentLabel = locales.find((l) => l.code === currentLocale)?.label ?? "EN";

  return (
    <header
      className={`header-section style-five ${sticky ? "sticky-on" : ""}`}
      data-testid="marketing-navbar"
    >
      <nav className="navbar navbar-expand-xl">
        <div className="container">
          {/* Navbar Brand — SVG logo */}
          <Link className="navbar-brand d-flex align-items-center" href="/">
            <Image
              src="/brand/eduvanta-logo-horizontal.svg"
              alt="EduVanta"
              width={160}
              height={38}
              priority
              className="h-auto"
              style={{ maxHeight: 38 }}
            />
          </Link>

          {/* Navbar Toggler (React state — no Bootstrap JS) */}
          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
          >
            <i className={`ti ${mobileOpen ? "ti-x" : "ti-menu-deep"}`}></i>
          </button>

          {/* Navbar Nav */}
          <div className={`collapse navbar-collapse${mobileOpen ? " show" : ""}`} id="eduVantaNav">
            {/* Nav Links */}
            <ul className="navbar-nav mx-auto">
              {navKeys.map((key, i) => (
                <li className="nav-item" key={navHrefs[i]}>
                  <Link
                    className="nav-link"
                    href={navHrefs[i]}
                    onClick={() => setMobileOpen(false)}
                  >
                    {t(key)}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Header Navigation CTAs */}
            <div className="header-navigation ms-auto d-flex flex-wrap align-items-center gap-3 mt-4 mt-xl-0">
              {/* Language Switcher */}
              <div className="position-relative">
                <button
                  className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
                  onClick={() => setLangOpen(!langOpen)}
                  aria-label="Switch language"
                  style={{ minWidth: 64 }}
                >
                  <i className="ti ti-language"></i>
                  {currentLabel}
                  <i className={`ti ti-chevron-${langOpen ? "up" : "down"} ms-1`} style={{ fontSize: "0.7rem" }}></i>
                </button>
                {langOpen && (
                  <ul
                    className="list-unstyled position-absolute bg-white shadow rounded py-1 mb-0"
                    style={{ top: "110%", insetInlineEnd: 0, minWidth: 100, zIndex: 9999 }}
                  >
                    {locales.map(({ code, label }) => (
                      <li key={code}>
                        <button
                          className={`btn btn-link w-100 text-start px-3 py-1 text-decoration-none${currentLocale === code ? " fw-bold" : ""}`}
                          onClick={() => switchLocale(code)}
                          style={{ fontSize: "0.9rem" }}
                        >
                          {label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Login link */}
              <Link
                href="/login"
                className="btn btn-outline-primary"
                onClick={() => setMobileOpen(false)}
              >
                {t("login")}
              </Link>

              {/* Live Demo CTA */}
              <Link
                href="/dashboard"
                className="btn btn-primary"
                onClick={() => setMobileOpen(false)}
              >
                <span>{t("liveDemo")} <i className="ti ti-arrow-up-right"></i></span>
                <span>{t("liveDemo")} <i className="ti ti-arrow-up-right"></i></span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
