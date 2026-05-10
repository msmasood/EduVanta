import { getTranslations } from "next-intl/server";

const moduleIcons = [
  "ti-users", "ti-school", "ti-report-analytics", "ti-calendar-check",
  "ti-coin", "ti-calculator", "ti-building-community", "ti-book",
  "ti-message-circle", "ti-certificate", "ti-users-group", "ti-settings-2",
];
const moduleKeys = ["m1","m2","m3","m4","m5","m6","m7","m8","m9","m10","m11","m12"] as const;

export default async function IntegrationsSection() {
  const t = await getTranslations("landing.integrations");
  return (
    <section className="integration-section bg-secondary">
      <div className="divider"></div>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-9 col-lg-8 col-xl-7 col-xxl-6">
            <div className="section-heading text-center">
              <span className="subtitle">{t("subtitle")}</span>
              <h2 className="mb-0 color-change">{t("title")}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="divider-sm"></div>

      <div className="container">
        <div className="integration-content">
          {moduleKeys.map((key, i) => (
            <div key={key} className="integration-card translateY10">
              <i
                className={`ti ${moduleIcons[i]} fs-1`}
                style={{ color: "var(--Primary)", width: 48, height: 48 }}
              ></i>
              <div>
                <h5>{t(`${key}Title`)}</h5>
                <p>{t(`${key}Desc`)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="divider"></div>
    </section>
  );
}
