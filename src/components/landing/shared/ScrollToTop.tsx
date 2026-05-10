"use client";

import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [showButton, setShowButton] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      setShowButton(scrollY > 600);
      const scrollPercent = (scrollY / (documentHeight - windowHeight)) * 100;
      setScrollProgress(scrollPercent);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  return (
    <button
      id="scrollTopButton"
      className={`startix-scrolltop ${showButton ? "scrolltop-show" : "scrolltop-hide"}`}
      onClick={scrollToTop}
      aria-label="Scroll to top"
      style={{ "--scroll-progress": `${scrollProgress}%` } as React.CSSProperties}
    >
      <i className="ti ti-arrow-narrow-up"></i>
    </button>
  );
}
