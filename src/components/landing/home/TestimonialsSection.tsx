"use client";

import { useTranslations } from "next-intl";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function TestimonialsSection() {
  const t = useTranslations("landing.testimonials");
  const testimonials = [
    { id: 1, text: t("t1Text"), name: t("t1Name"), role: t("t1Role"), rating: 5 },
    { id: 2, text: t("t2Text"), name: t("t2Name"), role: t("t2Role"), rating: 5 },
    { id: 3, text: t("t3Text"), name: t("t3Name"), role: t("t3Role"), rating: 5 },
    { id: 4, text: t("t4Text"), name: t("t4Name"), role: t("t4Role"), rating: 5 },
  ];
  return (
    <section className="testimonial-section">
      <div className="divider"></div>

      <div className="container">
        <div className="row g-5 align-items-end">
          <div className="col-12 col-sm-7">
            <div className="section-heading">
              <span className="subtitle">{t("subtitle")}</span>
              <h2 className="mb-0">{t("title")}</h2>
            </div>
          </div>

          <div className="col-12 col-sm-5">
            <div className="d-flex align-items-center justify-content-sm-end gap-4">
              <div className="testimonial-four-button-prev" style={{ cursor: "pointer" }}>
                <i className="ti ti-chevron-left"></i>
              </div>
              <div className="testimonial-four-button-next" style={{ cursor: "pointer" }}>
                <i className="ti ti-chevron-right"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="divider-sm"></div>

        <div className="testimonial-slide">
          <Swiper
            loop={true}
            spaceBetween={30}
            slidesPerView={2}
            navigation={{
              nextEl: ".testimonial-four-button-next",
              prevEl: ".testimonial-four-button-prev",
            }}
            pagination={{
              el: ".testimonial-pagination-four",
              clickable: true,
            }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            modules={[Navigation, Pagination, Autoplay]}
            breakpoints={{
              0: { slidesPerView: 1 },
              992: { slidesPerView: 2 },
            }}
            className="swiper testimonial-swiper-four"
          >
            {testimonials.map((item) => (
              <SwiperSlide key={item.id} className="swiper-slide">
                <div className="testimonial-card-four">
                  <div className="quote-icon">
                    <svg width="64" height="64">
                      <use href="#quoteIcon"></use>
                    </svg>
                  </div>
                  <div className="testimonial-info">
                    <p className="testimonial-text mb-4">{item.text}</p>
                    <div className="rating mb-2">
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <i key={i} className="ti ti-star-filled"></i>
                      ))}
                    </div>
                    <h5 className="mb-1">{item.name}</h5>
                    <p className="mb-0">{item.role}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="divider-sm"></div>
        <div className="testimonial-pagination-four"></div>
      </div>

      <div className="divider"></div>
    </section>
  );
}
