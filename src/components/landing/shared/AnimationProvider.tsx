"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * AnimationProvider — initializes GSAP ScrollTrigger and SplitText animations.
 *
 * Key constraints:
 * - No ScrollSmoother (GSAP Club license risk) — removed entirely
 * - No Bootstrap JS — removed entirely
 * - No #smooth-wrapper / #smooth-content DOM structure
 * - All animation code runs only inside useEffect (SSR safe)
 * - SplitText is free since GSAP 3.12
 */
export default function AnimationProvider() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    let ctx: gsap.Context;

    const initAnimations = () => {
      ctx = gsap.context(() => {
        const run = () => {
          // === Heading Chars (letter-by-letter animation) ===
          gsap.utils.toArray<HTMLElement>(".heading-chars").forEach((el) => {
            if (!el.querySelector(".gsap-split-char")) {
              const split = new SplitText(el, { type: "chars", smartWrap: true });
              gsap.fromTo(
                split.chars,
                { y: 20, autoAlpha: 0 },
                {
                  y: 0,
                  autoAlpha: 1,
                  scrollTrigger: {
                    trigger: el,
                    start: "top 95%",
                    toggleActions: "play none none none",
                  },
                  stagger: 0.05,
                  duration: 0.5,
                  ease: "power2.out",
                }
              );
            }
          });

          // === Heading Line (word-by-word) ===
          gsap.utils.toArray<HTMLElement>(".heading-line").forEach((el) => {
            if (!el.querySelector(".gsap-split-word")) {
              const delay = parseFloat(el.dataset.delay || "0");
              const split = new SplitText(el, { type: "words" });
              gsap.fromTo(
                split.words,
                { y: 15, autoAlpha: 0 },
                {
                  y: 0,
                  autoAlpha: 1,
                  delay,
                  scrollTrigger: {
                    trigger: el,
                    start: "top 90%",
                    toggleActions: "play none none none",
                  },
                  stagger: 0.04,
                  duration: 0.4,
                  ease: "power2.out",
                }
              );
            }
          });

          // === FadeInUp elements ===
          gsap.utils.toArray<HTMLElement>(".fadeInUp").forEach((el) => {
            const delay = parseFloat(el.dataset.delay || "0");
            gsap.fromTo(
              el,
              { y: 30, autoAlpha: 0 },
              {
                y: 0,
                autoAlpha: 1,
                delay,
                scrollTrigger: {
                  trigger: el,
                  start: "top 90%",
                  toggleActions: "play none none none",
                },
                duration: 0.6,
                ease: "power2.out",
              }
            );
          });

          // === TranslateY tilt on scroll ===
          gsap.utils.toArray<HTMLElement>(".translateY10").forEach((el) => {
            gsap.fromTo(
              el,
              { y: 20 },
              {
                y: -20,
                ease: "none",
                scrollTrigger: {
                  trigger: el,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1.5,
                },
              }
            );
          });
        };

        if (document.fonts?.ready) {
          document.fonts.ready.then(() => setTimeout(run, 100));
        } else {
          setTimeout(run, 500);
        }
      });
    };

    initAnimations();

    return () => {
      ctx?.revert();
    };
  }, []);

  return null;
}
