import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function CtaSection() {
  const t = await getTranslations("landing.ctaSection");
  return (
    <section className="cta-section">
      <div className="divider"></div>

      {/* Circles */}
      <div className="cta-circles">
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* CTA Content */}
      <div className="cta-content">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-10 col-md-8">
              <div className="text-center">
                <h2 className="mb-4 text-white heading-chars" data-delay="0.5">
                  {t("title")}
                </h2>
                <p className="mb-5 text-white fadeInUp" data-delay="0.75">
                  {t("desc")}
                </p>
                <div className="d-flex flex-wrap gap-4 justify-content-center">
                  <Link href="/dashboard" className="btn btn-dark fadeInUp" data-delay="0.8">
                    <span>{t("primary")} <i className="ti ti-arrow-up-right"></i></span>
                    <span>{t("primary")} <i className="ti ti-arrow-up-right"></i></span>
                  </Link>
                  <Link href="/pricing" className="btn btn-light fadeInUp" data-delay="0.9">
                    <span>{t("secondary")} <i className="ti ti-arrow-up-right"></i></span>
                    <span>{t("secondary")} <i className="ti ti-arrow-up-right"></i></span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="divider"></div>
    </section>
  );
}
