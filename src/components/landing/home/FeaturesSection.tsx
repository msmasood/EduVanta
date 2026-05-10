import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

export default async function FeaturesSection() {
  const t = await getTranslations("landing.features");
  return (
    <section className="features-section">
      <div className="divider"></div>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-9 col-lg-8 col-xl-7 col-xxl-6">
            <div className="section-heading text-center">
              <span className="subtitle">{t("subtitle")}</span>
              <h2 className="mb-4">{t("title")}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="divider-sm"></div>

      <div className="container">
        {/* Feature Block 1: Students & Academic */}
        <div className="row g-5 align-items-center">
          <div className="col-12 col-md-6">
            <div className="featured-img translateY10 me-xl-4">
              <Image
                className="tilt-image img-anim-left w-auto h-auto"
                src="/startix/img/bg-img/32.png"
                alt="Student and academic management"
                width={800}
                height={800}
                priority
              />
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="featured-content">
              <h2 className="mb-3">{t("block1Title")}</h2>
              <p className="mb-4">{t("block1Desc")}</p>
              <ul className="list-unstyled mb-5 featured-list">
                <li><svg width="28" height="28"><use href="#checkIcon2"></use></svg>{" "}{t("block1F1")}</li>
                <li><svg width="28" height="28"><use href="#checkIcon2"></use></svg>{" "}{t("block1F2")}</li>
                <li><svg width="28" height="28"><use href="#checkIcon2"></use></svg>{" "}{t("block1F3")}</li>
                <li><svg width="28" height="28"><use href="#checkIcon2"></use></svg>{" "}{t("block1F4")}</li>
              </ul>
              <Link href="/services" className="btn btn-primary">
                <span>{t("exploreModule")} <i className="ti ti-arrow-up-right"></i></span>
                <span>{t("exploreModule")} <i className="ti ti-arrow-up-right"></i></span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="divider"></div>

      <div className="container">
        {/* Feature Block 2: Finance & HRM */}
        <div className="row g-5 align-items-center">
          <div className="col-12 col-md-6 order-md-2">
            <div className="featured-img translateY10 ms-xl-4">
              <Image
                className="tilt-image img-anim-right w-auto h-auto"
                src="/startix/img/bg-img/33.png"
                alt="Finance and HR management"
                width={800}
                height={800}
              />
            </div>
          </div>
          <div className="col-12 col-md-6 order-md-1">
            <div className="featured-content">
              <h2 className="mb-3">{t("block2Title")}</h2>
              <p className="mb-4">{t("block2Desc")}</p>
              <ul className="list-unstyled mb-5 featured-list">
                <li><svg width="28" height="28"><use href="#checkIcon2"></use></svg>{" "}{t("block2F1")}</li>
                <li><svg width="28" height="28"><use href="#checkIcon2"></use></svg>{" "}{t("block2F2")}</li>
                <li><svg width="28" height="28"><use href="#checkIcon2"></use></svg>{" "}{t("block2F3")}</li>
                <li><svg width="28" height="28"><use href="#checkIcon2"></use></svg>{" "}{t("block2F4")}</li>
              </ul>
              <Link href="/services" className="btn btn-primary">
                <span>{t("exploreModule")} <i className="ti ti-arrow-up-right"></i></span>
                <span>{t("exploreModule")} <i className="ti ti-arrow-up-right"></i></span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="divider"></div>

      <div className="container">
        {/* Feature Block 3: Communication & Library */}
        <div className="row g-5 align-items-center">
          <div className="col-12 col-md-6">
            <div className="featured-img translateY10 me-xl-4">
              <Image
                className="tilt-image img-anim-left w-auto h-auto"
                src="/startix/img/bg-img/34.png"
                alt="Communication and library management"
                width={800}
                height={800}
              />
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="featured-content">
              <h2 className="mb-3">{t("block3Title")}</h2>
              <p className="mb-4">{t("block3Desc")}</p>
              <ul className="list-unstyled mb-5 featured-list">
                <li><svg width="28" height="28"><use href="#checkIcon2"></use></svg>{" "}{t("block3F1")}</li>
                <li><svg width="28" height="28"><use href="#checkIcon2"></use></svg>{" "}{t("block3F2")}</li>
                <li><svg width="28" height="28"><use href="#checkIcon2"></use></svg>{" "}{t("block3F3")}</li>
                <li><svg width="28" height="28"><use href="#checkIcon2"></use></svg>{" "}{t("block3F4")}</li>
              </ul>
              <Link href="/services" className="btn btn-primary">
                <span>{t("exploreModule")} <i className="ti ti-arrow-up-right"></i></span>
                <span>{t("exploreModule")} <i className="ti ti-arrow-up-right"></i></span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="divider"></div>
    </section>
  );
}
