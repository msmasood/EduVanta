"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const stepIcons = ["ti-settings", "ti-puzzle", "ti-rocket"] as const;

export default function HowItWorksSection() {
  const t = useTranslations("landing.howItWorks");
  const steps = [
    { id: 1, title: t("step1Title"), description: t("step1Desc"), icon: "ti-settings" },
    { id: 2, title: t("step2Title"), description: t("step2Desc"), icon: "ti-puzzle" },
    { id: 3, title: t("step3Title"), description: t("step3Desc"), icon: "ti-rocket" },
  ];
  return (
    <section className="how-works-section">
      <div className="divider"></div>

      <div className="container">
        <div className="row g-5 align-items-end justify-content-between">
          <div className="col-12 col-sm-6 col-xxl-5">
            <div className="section-heading">
              <span className="subtitle">{t("subtitle")}</span>
              <h2 className="mb-0">{t("title")}</h2>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-xxl-5">
            <div className="section-heading">
              <p className="mb-0">{t("desc")}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="divider-sm"></div>

      <div className="container">
        <div className="row g-5">
          <div className="col-12 col-sm-5">
            <div className="section-heading translateY10 pe-xxl-5">
              <Image
                src="/startix/img/bg-img/35.jpg"
                alt="EduVanta school setup"
                width={1000}
                height={1000}
                priority
              />
            </div>
          </div>

          <div className="col-12 col-sm-7">
            <div className="how-works-section">
              <Link href="/dashboard" className="get-started-btn">
                <h6 className="mb-0">{t("cta")}</h6>
                <span>
                  <i className="ti ti-arrow-right"></i>
                </span>
              </Link>

              <div className="divider-sm"></div>

              <Swiper
                loop={true}
                slidesPerView={3}
                spaceBetween={30}
                pagination={{ el: ".service-pagination", clickable: true }}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                modules={[Pagination, Autoplay]}
                breakpoints={{
                  0: { slidesPerView: 1, spaceBetween: 10 },
                  576: { slidesPerView: 2, spaceBetween: 24 },
                  992: { slidesPerView: 3, spaceBetween: 30 },
                }}
                className="swiper service-swiper"
              >
                {steps.map((step) => (
                  <SwiperSlide key={step.id} className="swiper-slide">
                    <div className="how-works-card">
                      <div className="how-works-icon mb-3">
                        <i className={`ti ${step.icon} fs-1`} style={{ color: "var(--Primary)" }}></i>
                      </div>
                      <h5 className="mb-2">{step.title}</h5>
                      <p className="mb-0">{step.description}</p>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              <div className="divider-sm"></div>
              <div className="service-pagination"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="divider"></div>
    </section>
  );
}
