"use client";

import React from "react";

interface CloudDividerProps {
  fillColor?: string;
  className?: string;
  flip?: boolean;
}

export default function CloudDivider({
  fillColor = "#f8fbff",
  className = "",
  flip = false,
}: CloudDividerProps) {
  return (
    <div
      className={`relative w-full overflow-hidden leading-none pointer-events-none select-none ${className} ${
        flip ? "rotate-180" : ""
      }`}
      aria-hidden="true"
    >
      <style>{`
        @keyframes oceanWaveLeft {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        @keyframes oceanWaveRight {
          0% {
            transform: translate3d(-50%, 0, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }
        .ocean-layer-1 {
          animation: oceanWaveLeft 20s linear infinite;
          will-change: transform;
        }
        .ocean-layer-2 {
          animation: oceanWaveRight 14s linear infinite;
          will-change: transform;
        }
        .ocean-layer-3 {
          animation: oceanWaveLeft 9s linear infinite;
          will-change: transform;
        }
        .ocean-layer-4 {
          animation: oceanWaveRight 6s linear infinite;
          will-change: transform;
        }
        @media (prefers-reduced-motion: reduce) {
          .ocean-layer-1,
          .ocean-layer-2,
          .ocean-layer-3,
          .ocean-layer-4 {
            animation: none !important;
          }
        }
      `}</style>

      {/* Multi-layered Animated Ocean Waves Horizon */}
      <div className="relative w-full h-14 sm:h-20 md:h-24">
        {/* Layer 1: Deep Ocean Base Swell (Slowest) */}
        <div className="absolute inset-0 w-[200%] h-full ocean-layer-1">
          <svg
            viewBox="0 0 2880 120"
            fill="none"
            preserveAspectRatio="none"
            className="w-full h-full block"
          >
            <path
              d="M 0,55 C 180,25 540,25 720,55 C 900,85 1260,85 1440,55 C 1620,25 1980,25 2160,55 C 2340,85 2700,85 2880,55 L 2880,120 L 0,120 Z"
              fill="#0284c7"
              fillOpacity="0.25"
            />
          </svg>
        </div>

        {/* Layer 2: Mid Tropical Azure Wave (Counter-flowing) */}
        <div className="absolute inset-0 w-[200%] h-full ocean-layer-2">
          <svg
            viewBox="0 0 2880 120"
            fill="none"
            preserveAspectRatio="none"
            className="w-full h-full block"
          >
            <path
              d="M 0,50 C 180,75 540,75 720,50 C 900,25 1260,25 1440,50 C 1620,75 1980,75 2160,50 C 2340,25 2700,25 2880,50 L 2880,120 L 0,120 Z"
              fill="#0ea5e9"
              fillOpacity="0.38"
            />
          </svg>
        </div>

        {/* Layer 3: Surface Aqua Crest Waves */}
        <div className="absolute inset-0 w-[200%] h-full ocean-layer-3">
          <svg
            viewBox="0 0 2880 120"
            fill="none"
            preserveAspectRatio="none"
            className="w-full h-full block"
          >
            <path
              d="M 0,60 C 90,42 270,42 360,60 C 450,78 630,78 720,60 C 810,42 990,42 1080,60 C 1170,78 1350,78 1440,60 C 1530,42 1710,42 1800,60 C 1890,78 2070,78 2160,60 C 2250,42 2430,42 2520,60 C 2610,78 2790,78 2880,60 L 2880,120 L 0,120 Z"
              fill="#38bdf8"
              fillOpacity="0.45"
            />
          </svg>
        </div>

        {/* Layer 4: Foreground Shore Foam & White Horizon (Seamlessly transitions into content below) */}
        <div className="absolute inset-0 w-[200%] h-full ocean-layer-4">
          <svg
            viewBox="0 0 2880 120"
            fill="none"
            preserveAspectRatio="none"
            className="w-full h-full block"
          >
            <path
              d="M 0,70 C 200,46 520,46 720,70 C 920,94 1240,94 1440,70 C 1640,46 1960,46 2160,70 C 2360,94 2680,94 2880,70 L 2880,120 L 0,120 Z"
              fill={fillColor}
            />
            {/* White Sea-Foam Crest Stroke */}
            <path
              d="M 0,70 C 200,46 520,46 720,70 C 920,94 1240,94 1440,70 C 1640,46 1960,46 2160,70 C 2360,94 2680,94 2880,70"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeOpacity="0.9"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
