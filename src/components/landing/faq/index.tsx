import { getTranslations } from "next-intl/server";
import MarketingWrapper from "../shared/MarketingWrapper";
import MarketingHeader from "../shared/MarketingHeader";
import MarketingFooter from "../shared/MarketingFooter";
import FaqSection from "../home/FaqSection";

export default async function FaqPage() {
  const t = await getTranslations("landing.faqPage");
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

        <FaqSection />
      </main>
      <MarketingFooter />
    </MarketingWrapper>
  );
}
