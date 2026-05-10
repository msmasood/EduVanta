import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

export default async function AboutSection() {
  const t = await getTranslations("landing.about");
  return (
    <section
      className="about-section style-one"
      style={{ backgroundImage: "url(/startix/img/core-img/shape4.png)" }}
    >
      <div className="divider"></div>
      <div className="container">
        <div className="row align-items-center g-5">
          {/* About Image */}
          <div className="col-12 col-md-6">
            <div className="about-img pe-xxl-5 translateY10">
              <Image
                className="tilt-image w-auto h-auto"
                src="/startix/img/bg-img/28.jpg"
                alt="EduVanta school management platform"
                width={800}
                height={800}
                priority
              />
            </div>
          </div>

          {/* About Content */}
          <div className="col-12 col-md-6">
            <div className="section-heading">
              <span className="subtitle">{t("subtitle")}</span>
              <h2 className="mb-4 color-change">
                {t("title")}
              </h2>
              <p className="mb-4">
                {t("desc")}
              </p>

              {/* Checklist */}
              <ul className="list-unstyled about-list mb-5">
                <li>
                  <svg width="28" height="28">
                    <use href="#checkIcon"></use>
                  </svg>
                  {t("check1")}
                </li>
                <li>
                  <svg width="28" height="28">
                    <use href="#checkIcon"></use>
                  </svg>
                  {t("check2")}
                </li>
                <li>
                  <svg width="28" height="28">
                    <use href="#checkIcon"></use>
                  </svg>
                  {t("check3")}
                </li>
              </ul>

              <Link href="/about" className="btn btn-primary">
                <span>
                  {t("cta")} <i className="ti ti-arrow-up-right"></i>
                </span>
                <span>
                  {t("cta")} <i className="ti ti-arrow-up-right"></i>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="divider"></div>
    </section>
  );
}
