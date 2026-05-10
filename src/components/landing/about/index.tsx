import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import MarketingWrapper from "../shared/MarketingWrapper";
import MarketingHeader from "../shared/MarketingHeader";
import MarketingFooter from "../shared/MarketingFooter";
import Count from "../shared/CountUp";

const valueIcons = ["ti-globe", "ti-shield-check", "ti-puzzle"] as const;
const statNumbers = [500, 250000, 12, 3] as const;
const statSuffixes = ["+", "+", "", ""] as const;

export default async function AboutPage() {
  const t = await getTranslations("landing.aboutPage");
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

        {/* Stats */}
        <section className="bg-secondary">
          <div className="divider"></div>
          <div className="container">
            <div className="row g-4 text-center justify-content-center">
              {[1,2,3,4].map((n) => (
                <div key={n} className="col-6 col-md-3">
                  <h2 style={{ color: "var(--Primary)" }}>
                    <Count number={statNumbers[n-1]} text={statSuffixes[n-1]} addStyle />
                  </h2>
                  <p className="mb-0">{t(`stat${n}Label`)}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="divider"></div>
        </section>

        {/* Mission */}
        <section className="about-section style-one">
          <div className="divider"></div>
          <div className="container">
            <div className="row align-items-center g-5">
              <div className="col-12 col-md-6">
                <div className="about-img translateY10">
                  <Image
                    className="w-auto h-auto tilt-image"
                    src="/startix/img/bg-img/28.jpg"
                    alt="EduVanta team"
                    width={800}
                    height={800}
                    priority
                  />
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="section-heading">
                  <span className="subtitle">{t("missionSubtitle")}</span>
                  <h2 className="mb-4">{t("missionTitle")}</h2>
                  <p className="mb-4">{t("missionP1")}</p>
                  <p className="mb-5">{t("missionP2")}</p>
                  <Link href="/dashboard" className="btn btn-primary">
                    <span>{t("missionCta")} <i className="ti ti-arrow-up-right"></i></span>
                    <span>{t("missionCta")} <i className="ti ti-arrow-up-right"></i></span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="divider"></div>
        </section>

        {/* Values */}
        <section className="features-section bg-secondary">
          <div className="divider"></div>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 col-md-8 text-center">
                <div className="section-heading">
                  <span className="subtitle">{t("valuesSubtitle")}</span>
                  <h2 className="mb-4">{t("valuesTitle")}</h2>
                </div>
              </div>
            </div>
            <div className="divider-sm"></div>
            <div className="row g-4">
              {[1,2,3].map((n) => (
                <div key={n} className="col-12 col-md-4 fadeInUp" data-delay={`${(n-1) * 0.2}`}>
                  <div className="p-4 h-100" style={{ background: "var(--Secondary)", borderRadius: 12 }}>
                    <i className={`ti ${valueIcons[n-1]} fs-1 mb-3 d-block`} style={{ color: "var(--Primary)" }}></i>
                    <h5 className="mb-2">{t(`v${n}Title`)}</h5>
                    <p className="mb-0">{t(`v${n}Desc`)}</p>
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
