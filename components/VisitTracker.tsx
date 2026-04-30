"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Track visit
    const trackVisit = async () => {
      try {
        await fetch("/api/track/visit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ page: pathname })
        });
      } catch (error) {
        // Silently fail
      }
    };

    trackVisit();
  }, [pathname]);

  return null;
}
