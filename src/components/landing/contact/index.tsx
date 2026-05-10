"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import MarketingWrapper from "../shared/MarketingWrapper";
import MarketingHeader from "../shared/MarketingHeader";
import MarketingFooter from "../shared/MarketingFooter";

export default function ContactPage() {
  const t = useTranslations("landing.contactPage");
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", school: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

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

        {/* Contact Section */}
        <section className="contact-section">
          <div className="divider"></div>
          <div className="container">
            <div className="row g-5">
              {/* Contact Info */}
              <div className="col-12 col-md-5">
                <div className="section-heading">
                  <span className="subtitle">{t("infoSubtitle")}</span>
                  <h2 className="mb-4">{t("infoTitle")}</h2>
                  <p className="mb-5">{t("infoDesc")}</p>

                  <ul className="list-unstyled contact-info-list">
                    <li className="d-flex align-items-start gap-3 mb-4">
                      <i className="ti ti-mail fs-4" style={{ color: "var(--Primary)" }}></i>
                      <div>
                        <strong>{t("emailLabel")}</strong>
                        <p className="mb-0">{t("emailValue")}</p>
                      </div>
                    </li>
                    <li className="d-flex align-items-start gap-3 mb-4">
                      <i className="ti ti-clock fs-4" style={{ color: "var(--Primary)" }}></i>
                      <div>
                        <strong>{t("responseLabel")}</strong>
                        <p className="mb-0">{t("responseValue")}</p>
                      </div>
                    </li>
                    <li className="d-flex align-items-start gap-3">
                      <i className="ti ti-globe fs-4" style={{ color: "var(--Primary)" }}></i>
                      <div>
                        <strong>{t("languagesLabel")}</strong>
                        <p className="mb-0">{t("languagesValue")}</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Contact Form */}
              <div className="col-12 col-md-7">
                <div
                  className="p-4 p-md-5"
                  style={{ background: "var(--Secondary)", borderRadius: 16 }}
                >
                  {submitted ? (
                    <div className="text-center py-5">
                      <i
                        className="ti ti-circle-check fs-1 mb-3"
                        style={{ color: "var(--Primary)" }}
                      ></i>
                      <h4 className="mb-2">{t("successTitle")}</h4>
                      <p className="mb-0">{t("successDesc")}</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      <div className="mb-4">
                        <label htmlFor="name" className="form-label">
                          {t("nameLabel")}
                        </label>
                        <input
                          type="text"
                          id="name"
                          className="form-control"
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder={t("namePlaceholder")}
                        />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="email" className="form-label">
                          {t("emailFieldLabel")}
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="form-control"
                          required
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder={t("emailFieldPlaceholder")}
                        />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="school" className="form-label">
                          {t("schoolLabel")}
                        </label>
                        <input
                          type="text"
                          id="school"
                          className="form-control"
                          value={form.school}
                          onChange={(e) => setForm({ ...form, school: e.target.value })}
                          placeholder={t("schoolPlaceholder")}
                        />
                      </div>
                      <div className="mb-5">
                        <label htmlFor="message" className="form-label">
                          {t("messageLabel")}
                        </label>
                        <textarea
                          id="message"
                          className="form-control"
                          required
                          rows={5}
                          value={form.message}
                          onChange={(e) => setForm({ ...form, message: e.target.value })}
                          placeholder={t("messagePlaceholder")}
                        ></textarea>
                      </div>
                      <button type="submit" className="btn btn-primary w-100">
                        <span>{t("submitBtn")} <i className="ti ti-send"></i></span>
                        <span>{t("submitBtn")} <i className="ti ti-send"></i></span>
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="divider"></div>
        </section>
      </main>
      <MarketingFooter />
    </MarketingWrapper>
  );
}
