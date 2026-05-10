import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import MarketingWrapper from "../shared/MarketingWrapper";
import MarketingHeader from "../shared/MarketingHeader";
import MarketingFooter from "../shared/MarketingFooter";

const postKeys = ["post1", "post2", "post3", "post4", "post5", "post6"] as const;

export default async function BlogPage() {
  const t = await getTranslations("landing.blogPage");
  const posts = postKeys.map((key) => ({
    key,
    category: t(`${key}Category`),
    title: t(`${key}Title`),
    excerpt: t(`${key}Excerpt`),
    date: t(`${key}Date`),
    readTime: t(`${key}ReadTime`),
  }));
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

        {/* Blog Posts */}
        <section className="blog-section">
          <div className="divider"></div>
          <div className="container">
            <div className="row g-4">
              {posts.map((post) => (
                <div key={post.key} className="col-12 col-md-6 col-lg-4 fadeInUp">
                  <article
                    className="h-100 p-4"
                    style={{ background: "var(--Secondary)", borderRadius: 12 }}
                  >
                    <span
                      className="badge mb-3"
                      style={{ background: "var(--SecondaryTwo)", color: "var(--Primary)" }}
                    >
                      {post.category}
                    </span>
                    <h5 className="mb-3">{post.title}</h5>
                    <p className="mb-4">{post.excerpt}</p>
                    <div className="d-flex justify-content-between align-items-center mt-auto">
                      <small className="text-muted">{post.date} · {post.readTime}</small>
                      <Link href="/blog" className="btn btn-sm btn-primary">
                        <span>{t("readBtn")} <i className="ti ti-arrow-up-right"></i></span>
                        <span>{t("readBtn")} <i className="ti ti-arrow-up-right"></i></span>
                      </Link>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>
          <div className="divider"></div>
        </section>
      </main>
      <MarketingFooter />
    </MarketingWrapper>
  );
}
