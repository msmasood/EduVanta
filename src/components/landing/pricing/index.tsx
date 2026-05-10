import { getTranslations } from "next-intl/server";
import MarketingWrapper from "../shared/MarketingWrapper";
import MarketingHeader from "../shared/MarketingHeader";
import MarketingFooter from "../shared/MarketingFooter";
import PricingSection from "../home/PricingSection";
import { Link } from "@/i18n/navigation";

export default async function PricingPage() {
  const t = await getTranslations("landing.pricingPage");
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

        {/* Pricing Cards */}
        <PricingSection />

        {/* FAQ Teaser */}
        <section className="cta-section">
          <div className="divider"></div>
          <div className="cta-circles">
            <span></span><span></span><span></span>
          </div>
          <div className="cta-content">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-12 col-md-8 text-center">
                  <h2 className="text-white mb-4 heading-chars" data-delay="0.3">
                    {t("faqTitle")}
                  </h2>
                  <p className="text-white fadeInUp mb-5" data-delay="0.5">
                    {t("faqDesc")}
                  </p>
                  <div className="d-flex gap-4 justify-content-center flex-wrap">
                    <Link href="/faq" className="btn btn-light fadeInUp" data-delay="0.6">
                      <span>{t("viewFaq")} <i className="ti ti-arrow-up-right"></i></span>
                      <span>{t("viewFaq")} <i className="ti ti-arrow-up-right"></i></span>
                    </Link>
                    <Link href="/contact" className="btn btn-dark fadeInUp" data-delay="0.7">
                      <span>{t("contactSales")} <i className="ti ti-arrow-up-right"></i></span>
                      <span>{t("contactSales")} <i className="ti ti-arrow-up-right"></i></span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="divider"></div>
        </section>
      </main>
      <MarketingFooter />
    </MarketingWrapper>
  );
}
