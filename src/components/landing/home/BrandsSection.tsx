"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const brands = [
  { id: 1, img: "/startix/img/partner-img/1.png", alt: "Partner 1" },
  { id: 2, img: "/startix/img/partner-img/2.png", alt: "Partner 2" },
  { id: 3, img: "/startix/img/partner-img/3.png", alt: "Partner 3" },
  { id: 4, img: "/startix/img/partner-img/4.png", alt: "Partner 4" },
  { id: 5, img: "/startix/img/partner-img/5.png", alt: "Partner 5" },
  { id: 6, img: "/startix/img/partner-img/6.png", alt: "Partner 6" },
  { id: 7, img: "/startix/img/partner-img/7.png", alt: "Partner 7" },
  { id: 8, img: "/startix/img/partner-img/8.png", alt: "Partner 8" },
  { id: 9, img: "/startix/img/partner-img/9.png", alt: "Partner 9" },
  { id: 10, img: "/startix/img/partner-img/10.png", alt: "Partner 10" },
];

export default function BrandsSection() {
  return (
    <div className="partner-section py-5 bg-secondary">
      <div className="container">
        <div className="partner-content">
          <Swiper
            loop={true}
            spaceBetween={24}
            slidesPerView={5}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            modules={[Autoplay]}
            breakpoints={{
              320: { slidesPerView: 2 },
              480: { slidesPerView: 3 },
              576: { slidesPerView: 4 },
              992: { slidesPerView: 5 },
            }}
            className="swiper partner-swiper"
          >
            {brands.map((brand) => (
              <SwiperSlide key={brand.id} className="swiper-slide">
                <div>
                  <Image
                    src={brand.img}
                    alt={brand.alt}
                    width={160}
                    height={80}
                    className="w-auto h-auto"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}
