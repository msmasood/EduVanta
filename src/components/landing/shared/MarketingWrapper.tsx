import type { ReactNode } from "react";
import AnimationProvider from "./AnimationProvider";
import ScrollToTop from "./ScrollToTop";
import Iconsvg from "../svg/Iconsvg";
import SvgIconTwo from "../svg/SvgIconTwo";

interface MarketingWrapperProps {
  children: ReactNode;
}

/**
 * MarketingWrapper — wraps all marketing pages with:
 * - GSAP AnimationProvider (ScrollTrigger, SplitText — NO ScrollSmoother)
 * - ScrollToTop button
 * - SVG symbol definitions (checkIcon, checkIcon2, checkIcon3, quoteIcon)
 *
 * Note: Startix's original used #smooth-wrapper / #smooth-content for ScrollSmoother.
 * That DOM structure is intentionally removed here (GSAP Club license risk).
 * CSS scroll-behavior: smooth is used instead for smooth scrolling.
 */
export default function MarketingWrapper({ children }: MarketingWrapperProps) {
  return (
    <>
      {children}
      <AnimationProvider />
      <ScrollToTop />
      <Iconsvg />
      <SvgIconTwo />
    </>
  );
}
