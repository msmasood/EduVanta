"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";

/**
 * MarketingFooter — adapted from Startix FooterOne.
 * EduVanta-specific content, locale-aware links.
 */
export default function MarketingFooter() {
  const t = useTranslations("landing");
  return (
    <footer className="footer-section">
      <div className="divider"></div>

      <div className="container">
        <div className="row g-5 g-md-4 g-xl-5">
          {/* Brand Column */}
          <div className="col-12 col-sm-6 col-md-4 col-xl-5">
            <div className="footer-card me-lg-5">
              <Link href="/" className="footer-logo mb-4 d-inline-block">
                <Image
                  src="/brand/eduvanta-logo-horizontal.svg"
                  alt="EduVanta"
                  width={160}
                  height={38}
                  className="h-auto"
                  style={{ maxHeight: 38 }}
                />
              </Link>
              <p className="mt-3">{t("footer.description")}</p>
              <div className="social-nav mt-4">
                <a href="#" aria-label="Facebook"><i className="ti ti-brand-facebook"></i></a>
                <a href="#" aria-label="LinkedIn"><i className="ti ti-brand-linkedin"></i></a>
                <a href="#" aria-label="X"><i className="ti ti-brand-x"></i></a>
                <a href="#" aria-label="Instagram"><i className="ti ti-brand-instagram"></i></a>
              </div>
            </div>
          </div>

          {/* Platform Column */}
          <div className="col-12 col-sm-6 col-md">
            <div className="footer-card">
              <h5 className="mb-4">{t("footer.platform")}</h5>
              <ul className="list-unstyled footer-nav">
                <li><Link href="/services">{t("footer.allModules")}</Link></li>
                <li><Link href="/pricing">{t("nav.pricing")}</Link></li>
                <li><Link href="/dashboard">{t("footer.liveDemo")}</Link></li>
                <li><Link href="/blog">{t("nav.blog")}</Link></li>
              </ul>
            </div>
          </div>

          {/* Company Column */}
          <div className="col-12 col-sm-6 col-md">
            <div className="footer-card">
              <h5 className="mb-4">{t("footer.company")}</h5>
              <ul className="list-unstyled footer-nav">
                <li><Link href="/about">{t("footer.aboutUs")}</Link></li>
                <li><Link href="/contact">{t("footer.contactUs")}</Link></li>
                <li><a href="#">{t("footer.privacyPolicy")}</a></li>
                <li><a href="#">{t("footer.terms")}</a></li>
              </ul>
            </div>
          </div>

          {/* Support Column */}
          <div className="col-12 col-sm-6 col-md">
            <div className="footer-card">
              <h5 className="mb-4">{t("footer.support")}</h5>
              <ul className="list-unstyled footer-nav">
                <li><Link href="/faq">{t("footer.faq")}</Link></li>
                <li><Link href="/contact">{t("footer.getHelp")}</Link></li>
                <li><Link href="/dashboard">{t("footer.liveDemo")}</Link></li>
                <li><a href="#">{t("footer.systemStatus")}</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="divider"></div>

      <div className="container">
        <div className="copyright-section">
          <p className="mb-0 copyright">
            Copyright &copy; {new Date().getFullYear()}{" "}
            <a href="#">EduVanta</a>. {t("footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
