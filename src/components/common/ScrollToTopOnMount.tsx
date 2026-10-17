"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTopOnMount() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Force instantaneous scroll reset to top of page on route change
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [pathname]);

  return null;
}
