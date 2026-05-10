import MarketingWrapper from "../shared/MarketingWrapper";
import MarketingHeader from "../shared/MarketingHeader";
import MarketingFooter from "../shared/MarketingFooter";
import HeroSection from "./HeroSection";
import BrandsSection from "./BrandsSection";
import AboutSection from "./AboutSection";
import FeaturesSection from "./FeaturesSection";
import HowItWorksSection from "./HowItWorksSection";
import IntegrationsSection from "./IntegrationsSection";
import PricingSection from "./PricingSection";
import TestimonialsSection from "./TestimonialsSection";
import FaqSection from "./FaqSection";
import CtaSection from "./CtaSection";

export default function HomeOne() {
  return (
    <MarketingWrapper>
      <MarketingHeader />
      <main>
        <HeroSection />
        <BrandsSection />
        <AboutSection />
        <FeaturesSection />
        <HowItWorksSection />
        <IntegrationsSection />
        <PricingSection />
        <TestimonialsSection />
        <FaqSection />
        <CtaSection />
      </main>
      <MarketingFooter />
    </MarketingWrapper>
  );
}
