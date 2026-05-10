"use client";

import { useEffect, useState } from "react";

interface StickyState {
  sticky: boolean;
}

const useSticky = (): StickyState => {
  const [sticky, setSticky] = useState(false);

  useEffect(() => {
    const stickyHeader = () => {
      setSticky(window.scrollY > 200);
    };
    window.addEventListener("scroll", stickyHeader, { passive: true });
    return () => window.removeEventListener("scroll", stickyHeader);
  }, []);

  return { sticky };
};

export default useSticky;
