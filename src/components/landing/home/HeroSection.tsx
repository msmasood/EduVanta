import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import Count from "../shared/CountUp";

export default async function HeroSection() {
  const t = await getTranslations("landing");
  return (
    <section
      className="hero-section"
      style={{ backgroundImage: "url(/startix/img/core-img/shape6.png)" }}
    >
      <div className="container">
        <div className="row justify-content-between g-4">
          {/* Hero Headline */}
          <div className="col-12 col-md-6">
            <div className="hero-content">
              <span className="subtitle mb-3 d-inline-block" style={{ opacity: 0.85 }}>
                {t("hero.eyebrow")}
              </span>
              <h2 className="text-white mb-0 heading-chars" data-delay="0.3">
                {t("hero.title")}
              </h2>
            </div>
          </div>

          {/* Hero Stats + Description */}
          <div className="col-12 col-md-6">
            <div className="hero-content">
              {/* Trust metric */}
              <div
                className="img-group-wrap d-flex align-items-center fadeInUp"
                data-delay="0.5"
              >
                <div className="imgs-group">
                  <Image
                    src="/startix/img/bg-img/30.png"
                    alt="School admin"
                    width={50}
                    height={50}
                  />
                  <Image
                    src="/startix/img/bg-img/31.png"
                    alt="Teacher"
                    width={50}
                    height={50}
                  />
                  <div>
                    <Count number={500} text="+" />
                  </div>
                </div>
                <h5 className="mb-0 ms-3">
                  {t("hero.trustBadge")}
                </h5>
              </div>

              {/* Description */}
              <p
                className="mt-5 mb-0 text-white heading-line"
                data-delay="0.6"
              >
                {t("hero.subtitle")}
              </p>

              {/* CTA Buttons */}
              <div className="d-flex flex-wrap gap-3 mt-5" data-delay="0.7">
                <Link href="/dashboard" className="btn btn-primary">
                  <span>{t("nav.liveDemo")} <i className="ti ti-device-desktop"></i></span>
                  <span>{t("nav.liveDemo")} <i className="ti ti-device-desktop"></i></span>
                </Link>
                <Link href="/register" className="btn btn-white btn-outline-light">
                  <span>{t("cta.getStarted")} <i className="ti ti-arrow-up-right"></i></span>
                  <span>{t("cta.getStarted")} <i className="ti ti-arrow-up-right"></i></span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="divider"></div>

        {/* Hero Dashboard Preview Image */}
        <div className="hero-image fadeInUp mt-0" data-delay="0.8">
          <Image
            src="/startix/img/bg-img/29.png"
            alt="EduVanta school management dashboard"
            width={1920}
            height={1080}
            className="w-auto h-auto"
            priority
          />
        </div>
      </div>
    </section>
  );
}
