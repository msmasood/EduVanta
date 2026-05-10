import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import ReactAccordion from "../shared/ReactAccordion";

export default async function FaqSection() {
  const t = await getTranslations("landing.faq");
  const faqItems = [
    { id: "faqQuestion1", question: t("q1"), answer: t("a1") },
    { id: "faqQuestion2", question: t("q2"), answer: t("a2") },
    { id: "faqQuestion3", question: t("q3"), answer: t("a3") },
    { id: "faqQuestion4", question: t("q4"), answer: t("a4") },
    { id: "faqQuestion5", question: t("q5"), answer: t("a5") },
  ];
  return (
    <section className="faq-section">
      <div className="divider"></div>

      <div className="container">
        <div className="row g-5">
          {/* Left Column */}
          <div className="col-12 col-md-6">
            <div className="section-heading pe-xxl-5">
              <span className="subtitle">{t("subtitle")}</span>
              <h2 className="mb-4">{t("title")}</h2>
              <p className="mb-5">{t("desc")}</p>
              <Link href="/contact" className="btn btn-primary">
                <span>{t("askCta")} <i className="ti ti-arrow-up-right"></i></span>
                <span>{t("askCta")} <i className="ti ti-arrow-up-right"></i></span>
              </Link>
              <div className="question-mark">
                <Image
                  className="w-auto h-auto"
                  src="/startix/img/core-img/question-mark.png"
                  alt=""
                  width={200}
                  height={200}
                  priority
                />
              </div>
            </div>
          </div>

          {/* Right Column — Accordion */}
          <div className="col-12 col-md-6">
            <ReactAccordion items={faqItems} defaultOpenId="faqQuestion1" />
          </div>
        </div>
      </div>

      <div className="divider"></div>
    </section>
  );
}
