"use client";

import React from "react";

export default function SkyBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Base Sky Atmosphere Gradient with soft celestial blue tint */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#e0f2fe]/60 via-[#f0f9ff]/80 to-[#e0f2fe]/50" />

      {/* Gentle Sun Radial Warm Glow */}
      <div className="absolute -top-32 right-1/4 w-[750px] h-[750px] bg-gradient-to-br from-amber-200/40 via-sky-300/35 to-transparent rounded-full blur-[140px]" />

      {/* Ambient Azure Mist Glows */}
      <div className="absolute top-1/3 -left-40 w-[650px] h-[650px] bg-gradient-to-tr from-sky-400/25 via-blue-200/25 to-transparent rounded-full blur-[130px]" />
      <div className="absolute top-2/3 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-sky-300/25 via-indigo-200/15 to-transparent rounded-full blur-[120px]" />
    </div>
  );
}
