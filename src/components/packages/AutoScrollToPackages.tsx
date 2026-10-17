"use client";

import { useEffect } from "react";

export default function AutoScrollToPackages() {
  useEffect(() => {
    const scrollToSection = () => {
      const el = document.getElementById("packages-section");
      if (el) {
        const navHeight = 72; // Account for fixed navbar height
        const targetPos = Math.max(0, el.getBoundingClientRect().top + window.scrollY - navHeight);
        window.scrollTo({
          top: targetPos,
          behavior: "smooth",
        });
      }
    };

    // Trigger smooth auto-scroll after initial layout render
    const timer = setTimeout(scrollToSection, 350);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
