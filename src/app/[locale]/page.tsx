import { MarketingNavbar } from "@/components/marketing/marketing-navbar";
import { LandingHero } from "@/components/marketing/landing-hero";
import { TrustMetrics } from "@/components/marketing/trust-metrics";
import { ProductModuleGrid } from "@/components/marketing/product-module-grid";
import { RoleExperienceSection } from "@/components/marketing/role-experience-section";
import { DashboardPreviewSection } from "@/components/marketing/dashboard-preview-section";
import { MultilingualCurrencySection } from "@/components/marketing/multilingual-currency-section";
import { FinanceHighlightSection } from "@/components/marketing/finance-highlight-section";
import { AcademicHighlightSection } from "@/components/marketing/academic-highlight-section";
import { CommunicationHighlightSection } from "@/components/marketing/communication-highlight-section";
import { PricingTeaser } from "@/components/marketing/pricing-teaser";
import { FaqSection } from "@/components/marketing/faq-section";
import { FinalCta } from "@/components/marketing/final-cta";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <MarketingNavbar />
      <main>
        <LandingHero />
        <TrustMetrics />
        <ProductModuleGrid />
        <RoleExperienceSection />
        <DashboardPreviewSection />
        <MultilingualCurrencySection />
        <FinanceHighlightSection />
        <AcademicHighlightSection />
        <CommunicationHighlightSection />
        <PricingTeaser />
        <FaqSection />
        <FinalCta />
      </main>
      <MarketingFooter />
    </div>
  );
}