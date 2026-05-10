"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const planPrices = [
  { monthly: "$0", yearly: "$0", delay: "0.2", key: "s1", included: [true, true, true, false, false, false] },
  { monthly: "$49", yearly: "$499", delay: "0.6", key: "s2", included: [true, true, true, true, false, false] },
  { monthly: "$99", yearly: "$999", delay: "1.0", key: "s3", included: [true, true, true, true, true, true] },
] as const;

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);
  const t = useTranslations("landing.pricing");

  return (
    <section
      className="pricing-section bg-secondary"
      style={{ backgroundImage: "url(/startix/img/core-img/shape2.png)" }}
    >
      <div className="divider"></div>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-9 col-lg-8 col-xl-7 col-xxl-6">
            <div className="section-heading text-center">
              <span className="subtitle">{t("subtitle")}</span>
              <h2 className="mb-4">{t("title")}</h2>
            </div>

            {/* Monthly / Yearly Toggle */}
            <div className="price-plan-switch">
              <div className="form-check form-switch d-flex justify-content-center align-items-center gap-2">
                <label className="form-check-label" htmlFor="pricingToggle">
                  {t("monthly")}
                </label>
                <input
                  className="form-check-input mt-0"
                  type="checkbox"
                  id="pricingToggle"
                  checked={isYearly}
                  onChange={() => setIsYearly(!isYearly)}
                />
                <label className="form-check-label" htmlFor="pricingToggle">
                  {t("yearly")}{" "}
                  <span className="badge" style={{ background: "var(--Primary)", fontSize: "0.7rem" }}>
                    {t("save")}
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="divider-sm"></div>

      <div className="container">
        <div className="row g-4 justify-content-center">
          {planPrices.map((plan) => (
            <div
              key={plan.key}
              className="col-12 col-md-6 col-lg-4 fadeInUp"
              data-delay={plan.delay}
            >
              <div className="pricing-card translateY10">
                <div className="pricing-header text-center">
                  <h5>{t(`${plan.key}Title`)}</h5>
                  <p>{t(`${plan.key}Subtitle`)}</p>
                  <h2 className="mb-0">
                    {isYearly ? plan.yearly : plan.monthly}
                    <span>{isYearly ? t("perYear") : t("perMonth")}</span>
                  </h2>
                </div>

                <ul className="pricing-content list-unstyled">
                  {[1,2,3,4,5,6].map((n) => (
                    <li key={n} className={plan.included[n-1] ? "" : "not-included"}>
                      <svg width="28" height="28">
                        <use href={plan.included[n-1] ? "#checkIcon" : "#checkIcon2"}></use>
                      </svg>
                      {t(`${plan.key}F${n}`)}
                    </li>
                  ))}
                </ul>

                <div className="text-center mt-4">
                  <Link href="/dashboard" className="btn btn-primary w-100">
                    <span>{t("cta")} <i className="ti ti-arrow-up-right"></i></span>
                    <span>{t("cta")} <i className="ti ti-arrow-up-right"></i></span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="divider"></div>
    </section>
  );
}
