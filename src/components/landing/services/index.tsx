import { getTranslations } from "next-intl/server";
import MarketingWrapper from "../shared/MarketingWrapper";
import MarketingHeader from "../shared/MarketingHeader";
import MarketingFooter from "../shared/MarketingFooter";
import { Link } from "@/i18n/navigation";

const moduleIcons = [
  "ti-users", "ti-school", "ti-report-analytics", "ti-calendar-check",
  "ti-book", "ti-certificate", "ti-coin", "ti-calculator",
  "ti-building-community", "ti-message-circle", "ti-exam", "ti-settings-2",
];
const moduleKeys = ["m1","m2","m3","m4","m5","m6","m7","m8","m9","m10","m11","m12"] as const;

export default async function ServicesPage() {
  const t = await getTranslations("landing.servicesPage");
  return (
    <MarketingWrapper>
      <MarketingHeader />
      <main>
        {/* Hero */}
        <section
          className="hero-section"
          style={{ backgroundImage: "url(/startix/img/core-img/shape6.png)" }}
        >
          <div className="container">
            <div className="row justify-content-center text-center">
              <div className="col-12 col-md-8">
                <div className="hero-content">
                  <span className="subtitle text-white opacity-75">{t("heroSubtitle")}</span>
                  <h2 className="text-white mb-4 heading-chars" data-delay="0.3">
                    {t("heroTitle")}
                  </h2>
                  <p className="text-white heading-line" data-delay="0.5">
                    {t("heroDesc")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Modules Grid */}
        <section className="features-section">
          <div className="divider"></div>
          <div className="container">
            <div className="row g-4">
              {moduleKeys.map((key, i) => (
                <div key={key} className="col-12 col-sm-6 col-lg-4 fadeInUp" data-delay={`${(i % 3) * 0.2}`}>
                  <div
                    className="h-100 p-4"
                    style={{ background: "var(--Secondary)", borderRadius: 12 }}
                  >
                    <i
                      className={`ti ${moduleIcons[i]} fs-1 mb-3 d-block`}
                      style={{ color: "var(--Primary)" }}
                    ></i>
                    <h5 className="mb-2">{t(`${key}Title`)}</h5>
                    <p className="mb-4">{t(`${key}Desc`)}</p>
                    <Link href="/dashboard" className="btn btn-primary btn-sm">
                      <span>{t("explore")} <i className="ti ti-arrow-up-right"></i></span>
                      <span>{t("explore")} <i className="ti ti-arrow-up-right"></i></span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="divider"></div>
        </section>
      </main>
      <MarketingFooter />
    </MarketingWrapper>
  );
}
