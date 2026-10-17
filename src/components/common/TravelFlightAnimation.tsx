"use client";

import React from "react";

interface TravelFlightAnimationProps {
  className?: string;
  showLandmarks?: boolean;
}

export default function TravelFlightAnimation({
  className = "",
  showLandmarks = true,
}: TravelFlightAnimationProps) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}
      aria-hidden="true"
    >
      <style>{`
        @keyframes dashFlow {
          from {
            stroke-dashoffset: 0;
          }
          to {
            stroke-dashoffset: -240;
          }
        }
        @keyframes flagWaveMotion {
          0% {
            transform: rotate(0deg) skewY(0deg) scaleY(1);
          }
          25% {
            transform: rotate(-1.2deg) skewY(-1.2deg) scaleY(0.985);
          }
          50% {
            transform: rotate(0.8deg) skewY(1deg) scaleY(1.015);
          }
          75% {
            transform: rotate(-0.6deg) skewY(-0.8deg) scaleY(0.99);
          }
          100% {
            transform: rotate(0deg) skewY(0deg) scaleY(1);
          }
        }
        @keyframes rippleTravel {
          0% {
            transform: translateX(-30px);
            opacity: 0.25;
          }
          50% {
            opacity: 0.45;
          }
          100% {
            transform: translateX(190px);
            opacity: 0.25;
          }
        }
        @keyframes pinRadarPing {
          0% {
            r: 3;
            opacity: 0.8;
          }
          70% {
            r: 14;
            opacity: 0;
          }
          100% {
            r: 14;
            opacity: 0;
          }
        }
        .flight-dash-animated {
          animation: dashFlow 28s linear infinite;
        }
        .flight-dash-animated-fast {
          animation: dashFlow 20s linear infinite;
        }
        .flight-flag-wave {
          transform-origin: -105px 0px;
          animation: flagWaveMotion 3.2s ease-in-out infinite;
        }
        .flight-ripple-shimmer {
          animation: rippleTravel 2.4s ease-in-out infinite;
        }
        .radar-ping-circle {
          animation: pinRadarPing 3s cubic-bezier(0, 0.2, 0.8, 1) infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .flight-dash-animated,
          .flight-dash-animated-fast,
          .flight-flag-wave,
          .flight-ripple-shimmer,
          .radar-ping-circle {
            animation: none !important;
          }
        }
      `}</style>

      {/* SVG Canvas for Flight Paths, Planes, Banner & World Elements */}
      <svg
        className="w-full h-full"
        viewBox="0 0 1600 620"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Cyan Dash Gradients */}
          <linearGradient id="mainTrailGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.15" />
            <stop offset="35%" stopColor="#0ea5e9" stopOpacity="0.75" />
            <stop offset="70%" stopColor="#0284c7" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0369a1" stopOpacity="0.3" />
          </linearGradient>

          <linearGradient id="secondaryTrailGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#bae6fd" stopOpacity="0.2" />
          </linearGradient>

          {/* Airplane Fuselage Gradient */}
          <linearGradient id="fuselageShade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="55%" stopColor="#f1f5f9" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>

          {/* Aircraft Wing Shading */}
          <linearGradient id="wingShade" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>

          {/* Tailfin Gradient */}
          <linearGradient id="tailfinBlue" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>

          {/* Fabric Banner Background Gradient */}
          <linearGradient id="bannerFabricGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="65%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#f0f9ff" />
          </linearGradient>

          {/* Soft Drop Shadow for Banner */}
          <filter id="bannerDropShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="3"
              stdDeviation="4"
              floodColor="#0284c7"
              floodOpacity="0.16"
            />
          </filter>

          {/* Ripple Wave Highlight Overlay */}
          <linearGradient id="rippleHighlight" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="35%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="65%" stopColor="#0ea5e9" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* Landmarks Gradient */}
          <linearGradient id="landmarksFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.22" />
            <stop offset="60%" stopColor="#7dd3fc" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#bae6fd" stopOpacity="0.32" />
          </linearGradient>

          {/* Horizon Arc Gradient */}
          <linearGradient id="horizonArcGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#bae6fd" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* ─── 1. World Map Faint Texture ─── */}
        <g className="world-map-continents" opacity="0.16">
          {/* Americas */}
          <path
            d="M 220,170 C 260,165 310,195 315,240 C 320,270 290,295 300,340 C 310,380 340,410 325,450 C 310,480 270,440 255,390 C 240,350 250,310 230,270 C 210,230 190,180 220,170 Z"
            fill="#0284c7"
          />
          {/* Europe & Africa */}
          <path
            d="M 680,180 C 720,165 770,180 780,210 C 790,240 760,255 775,290 C 790,330 830,370 815,440 C 800,480 750,470 720,430 C 690,390 710,330 685,280 C 665,240 655,200 680,180 Z"
            fill="#0284c7"
          />
          {/* Eurasia */}
          <path
            d="M 820,150 C 920,135 1060,145 1180,175 C 1280,200 1340,240 1300,285 C 1260,320 1180,310 1120,335 C 1060,360 980,330 920,305 C 860,280 800,290 780,240 C 765,200 780,160 820,150 Z"
            fill="#0284c7"
          />
          {/* Australia */}
          <path
            d="M 1240,410 C 1300,400 1350,430 1340,475 C 1330,510 1270,520 1230,490 C 1200,460 1210,420 1240,410 Z"
            fill="#0284c7"
          />
        </g>

        {/* ─── 2. Key Location Pins with Pulsing Radar Pings ─── */}
        {/* Pin 1: Europe (Paris/Rome) */}
        <g transform="translate(730, 210)">
          <circle className="radar-ping-circle" r="4" fill="#0ea5e9" />
          <path
            d="M 0,0 C -3,-3 -5,-6 -5,-9 C -5,-12 -2.5,-15 0,-15 C 2.5,-15 5,-12 5,-9 C 5,-6 3,-3 0,0 Z"
            fill="#0284c7"
          />
          <circle cx="0" cy="-9" r="1.8" fill="#ffffff" />
        </g>

        {/* Pin 2: International Transit Hub */}
        <g transform="translate(865, 275)">
          <circle className="radar-ping-circle" r="4" fill="#0ea5e9" style={{ animationDelay: "0.8s" }} />
          <path
            d="M 0,0 C -3,-3 -5,-6 -5,-9 C -5,-12 -2.5,-15 0,-15 C 2.5,-15 5,-12 5,-9 C 5,-6 3,-3 0,0 Z"
            fill="#0284c7"
          />
          <circle cx="0" cy="-9" r="1.8" fill="#ffffff" />
        </g>

        {/* Pin 3: Nepal / Kathmandu Base */}
        <g transform="translate(985, 260)">
          <circle className="radar-ping-circle" r="4" fill="#f97316" style={{ animationDelay: "1.4s" }} />
          <path
            d="M 0,0 C -3.5,-3.5 -6,-7 -6,-10.5 C -6,-14 -3,-17.5 0,-17.5 C 3,-17.5 6,-14 6,-10.5 C 6,-7 3.5,-3.5 0,0 Z"
            fill="#f97316"
          />
          <circle cx="0" cy="-10.5" r="2.2" fill="#ffffff" />
        </g>

        {/* Pin 4: Southeast Asia (Thailand / Bali) */}
        <g transform="translate(1085, 330)">
          <circle className="radar-ping-circle" r="4" fill="#0ea5e9" style={{ animationDelay: "2.1s" }} />
          <path
            d="M 0,0 C -3,-3 -5,-6 -5,-9 C -5,-12 -2.5,-15 0,-15 C 2.5,-15 5,-12 5,-9 C 5,-6 3,-3 0,0 Z"
            fill="#0284c7"
          />
          <circle cx="0" cy="-9" r="1.8" fill="#ffffff" />
        </g>

        {/* Pin 5: East Asia (Japan) */}
        <g transform="translate(1260, 245)">
          <circle className="radar-ping-circle" r="4" fill="#0ea5e9" style={{ animationDelay: "1.0s" }} />
          <path
            d="M 0,0 C -3,-3 -5,-6 -5,-9 C -5,-12 -2.5,-15 0,-15 C 2.5,-15 5,-12 5,-9 C 5,-6 3,-3 0,0 Z"
            fill="#0284c7"
          />
          <circle cx="0" cy="-9" r="1.8" fill="#ffffff" />
        </g>

        {/* ─── 3. Curved Dashed Flight Paths ─── */}
        {/* Main Curved Flight Path Trajectory */}
        <path
          id="mainFlightTrajectory"
          d="M -320,165 C 160,65 540,225 960,105 C 1220,35 1480,125 1950,55"
          fill="none"
          stroke="url(#mainTrailGrad)"
          strokeWidth="2.4"
          strokeDasharray="9 9"
          strokeLinecap="round"
          className="flight-dash-animated"
        />

        {/* Secondary Curved Flight Path (Mid Sky) */}
        <path
          id="secondaryFlightTrajectory"
          d="M -240,365 C 240,265 670,415 1110,305 C 1370,235 1620,335 1900,265"
          fill="none"
          stroke="url(#secondaryTrailGrad)"
          strokeWidth="1.8"
          strokeDasharray="7 7"
          strokeLinecap="round"
          className="flight-dash-animated-fast"
        />

        {/* Third Ambient Dashed Curve (Lower Horizon) */}
        <path
          d="M -80,510 C 360,430 760,290 1160,250 C 1460,220 1690,135 1880,110"
          fill="none"
          stroke="url(#secondaryTrailGrad)"
          strokeWidth="1.4"
          strokeDasharray="6 6"
          strokeLinecap="round"
          opacity="0.65"
        />

        {/* ─── 4. Secondary Distant Airplane (Provides Airspace Depth) ─── */}
        <g opacity="0.8">
          <animateMotion
            dur="34s"
            repeatCount="indefinite"
            rotate="auto"
            path="M -240,365 C 240,265 670,415 1110,305 C 1370,235 1620,335 1900,265"
          />
          {/* Small Jet Silhouette */}
          <g transform="scale(0.38) translate(0, 0)">
            {/* Fuselage */}
            <path
              d="M 35,0 C 30,-3 15,-4 0,-4 C -20,-4 -35,-2 -40,0 C -35,2 -20,4 0,4 C 15,4 30,3 35,0 Z"
              fill="#0284c7"
            />
            {/* Swept Wings */}
            <path
              d="M 5,-3 L -15,-30 L -22,-29 L -6,-3 Z"
              fill="#0ea5e9"
            />
            <path
              d="M 5,3 L -15,30 L -22,29 L -6,3 Z"
              fill="#0ea5e9"
            />
            {/* Tailfin */}
            <path
              d="M -25,-2 L -38,-14 L -42,-13 L -34,-1 Z"
              fill="#0369a1"
            />
            {/* Tiny Contrail */}
            <line
              x1="-42"
              y1="0"
              x2="-95"
              y2="0"
              stroke="#bae6fd"
              strokeWidth="2"
              strokeDasharray="4 2"
              opacity="0.7"
            />
          </g>
        </g>

        {/* ─── 5. MAIN AIRPLANE WITH TOWED COMPANY LOGO BANNER ─── */}
        <g>
          {/* Smooth, continuous path following across the screen */}
          <animateMotion
            dur="26s"
            repeatCount="indefinite"
            rotate="auto"
            path="M -320,165 C 160,65 540,225 960,105 C 1220,35 1480,125 1950,55"
          />

          {/* 5A. Towline Cables connecting airplane tail to the fabric banner */}
          <g opacity="0.85">
            {/* Top Cable */}
            <line
              x1="-48"
              y1="0"
              x2="-108"
              y2="-15"
              stroke="#64748b"
              strokeWidth="1.2"
              strokeDasharray="4 1"
            />
            {/* Bottom Cable */}
            <line
              x1="-48"
              y1="0"
              x2="-108"
              y2="15"
              stroke="#64748b"
              strokeWidth="1.2"
              strokeDasharray="4 1"
            />
            {/* Tow Spreader Bar (Holds leading edge of fabric taut) */}
            <line
              x1="-108"
              y1="-16"
              x2="-108"
              y2="16"
              stroke="#475569"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>

          {/* 5B. Towed Fabric Banner with SkyWalk Tours & Travels Logo */}
          <g className="flight-flag-wave">
            {/* Fabric Banner Outer Body */}
            <rect
              x="-288"
              y="-28"
              width="180"
              height="56"
              rx="4"
              fill="url(#bannerFabricGrad)"
              stroke="rgba(14, 165, 233, 0.4)"
              strokeWidth="1"
              filter="url(#bannerDropShadow)"
            />

            {/* Trailing Flag Edge Trim Accent */}
            <path
              d="M -288,-28 L -288,28"
              stroke="#0ea5e9"
              strokeWidth="2"
              strokeOpacity="0.8"
            />

            {/* Official SkyWalk Company Logo Image */}
            <image
              href="/images/logo.png"
              x="-282"
              y="-22"
              width="44"
              height="44"
              preserveAspectRatio="xMidYMid meet"
            />

            {/* Official Company Name Typography */}
            <text
              x="-232"
              y="-4"
              fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
              fontWeight="800"
              fontSize="16"
              fill="#0a1628"
              letterSpacing="-0.3px"
            >
              SkyWalk
            </text>
            <text
              x="-231"
              y="11"
              fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
              fontWeight="800"
              fontSize="8"
              fill="#0ea5e9"
              letterSpacing="1.8px"
            >
              TOURS &amp; TRAVELS
            </text>

            {/* Ripple Wave Highlight that shines across fabric */}
            <g clipPath="url(#flagClip)">
              <rect
                className="flight-ripple-shimmer"
                x="-288"
                y="-28"
                width="70"
                height="56"
                fill="url(#rippleHighlight)"
                pointerEvents="none"
              />
            </g>
            <clipPath id="flagClip">
              <rect x="-288" y="-28" width="180" height="56" rx="4" />
            </clipPath>
          </g>

          {/* 5C. Detailed Commercial Jet Airliner SVG */}
          <g transform="scale(0.9) translate(0, 0)">
            {/* Swept Left Wing (Upper) */}
            <path
              d="M 12,-6 L -18,-46 C -21,-49 -24,-49 -26,-46 L -28,-44 L -8,-6 Z"
              fill="url(#wingShade)"
              stroke="#94a3b8"
              strokeWidth="0.6"
            />
            {/* Left Winglet (Sky-Blue) */}
            <path
              d="M -24,-46 L -27,-53 L -30,-51 L -27,-44 Z"
              fill="#0ea5e9"
            />

            {/* Swept Right Wing (Lower) */}
            <path
              d="M 12,6 L -18,46 C -21,49 -24,49 -26,46 L -28,44 L -8,6 Z"
              fill="url(#wingShade)"
              stroke="#94a3b8"
              strokeWidth="0.6"
            />
            {/* Right Winglet (Sky-Blue) */}
            <path
              d="M -24,46 L -27,53 L -30,51 L -27,44 Z"
              fill="#0ea5e9"
            />

            {/* Left Jet Engine (Pylon mounted under wing) */}
            <rect
              x="-4"
              y="-24"
              width="18"
              height="8"
              rx="3"
              fill="#ffffff"
              stroke="#94a3b8"
              strokeWidth="0.5"
            />
            <ellipse cx="14" cy="-20" rx="1.5" ry="4" fill="#0f172a" />
            <path
              d="M -4,-23 L -7,-22 L -7,-18 L -4,-17 Z"
              fill="#0284c7"
            />

            {/* Right Jet Engine */}
            <rect
              x="-4"
              y="16"
              width="18"
              height="8"
              rx="3"
              fill="#ffffff"
              stroke="#94a3b8"
              strokeWidth="0.5"
            />
            <ellipse cx="14" cy="20" rx="1.5" ry="4" fill="#0f172a" />
            <path
              d="M -4,17 L -7,18 L -7,22 L -4,23 Z"
              fill="#0284c7"
            />

            {/* Fuselage Aerodynamic Body */}
            <path
              d="M 54,0 C 52,-3.5 42,-7.5 20,-8.5 C -10,-8.5 -36,-6.5 -48,-3 C -51,-1 -51,1 -48,3 C -36,6.5 -10,8.5 20,8.5 C 42,7.5 52,3.5 54,0 Z"
              fill="url(#fuselageShade)"
              stroke="#94a3b8"
              strokeWidth="0.6"
            />

            {/* Nose Cockpit Windshield (Dark Tint) */}
            <path
              d="M 44,-2.5 C 42,-4.5 38,-4.5 35,-3.8 L 35,-0.8 L 43,-0.8 Z"
              fill="#0f172a"
            />
            <path
              d="M 44,2.5 C 42,4.5 38,4.5 35,3.8 L 35,0.8 L 43,0.8 Z"
              fill="#0f172a"
            />

            {/* Passenger Cabin Window Line */}
            <g fill="#1e293b" opacity="0.85">
              <circle cx="28" cy="-2.5" r="0.9" />
              <circle cx="24" cy="-2.5" r="0.9" />
              <circle cx="20" cy="-2.5" r="0.9" />
              <circle cx="16" cy="-2.5" r="0.9" />
              <circle cx="12" cy="-2.5" r="0.9" />
              <circle cx="8" cy="-2.5" r="0.9" />
              <circle cx="4" cy="-2.5" r="0.9" />
              <circle cx="0" cy="-2.5" r="0.9" />
              <circle cx="-4" cy="-2.5" r="0.9" />
              <circle cx="-8" cy="-2.5" r="0.9" />
              <circle cx="-12" cy="-2.5" r="0.9" />
              <circle cx="-16" cy="-2.5" r="0.9" />
              <circle cx="-20" cy="-2.5" r="0.9" />
              <circle cx="-24" cy="-2.5" r="0.9" />
              <circle cx="-28" cy="-2.5" r="0.9" />
            </g>

            {/* Horizontal Stabilizers at Tail */}
            <path
              d="M -34,-3 L -49,-19 L -53,-17 L -44,-2 Z"
              fill="#e2e8f0"
              stroke="#94a3b8"
              strokeWidth="0.5"
            />
            <path
              d="M -34,3 L -49,19 L -53,17 L -44,2 Z"
              fill="#e2e8f0"
              stroke="#94a3b8"
              strokeWidth="0.5"
            />

            {/* Tailfin (Vertical Stabilizer) in SkyWalk Blue */}
            <path
              d="M -28,-2 L -48,-25 C -50,-27 -53,-26 -52,-23 L -44,-1 Z"
              fill="url(#tailfinBlue)"
              stroke="#0369a1"
              strokeWidth="0.6"
            />
            {/* White Tailfin Accent Slash */}
            <path
              d="M -36,-10 L -46,-22 L -48,-21 L -40,-9 Z"
              fill="#ffffff"
              opacity="0.9"
            />
          </g>
        </g>

        {/* ─── 6. Subtle World Landmarks Silhouette (Matching Reference Image) ─── */}
        {showLandmarks && (
          <g className="world-landmarks" opacity="0.35">
            {/* Curved Earth Horizon Arc */}
            <path
              d="M -100,620 Q 800,530 1700,620 L 1700,650 L -100,650 Z"
              fill="url(#horizonArcGrad)"
            />

            {/* Landmark 1: Eiffel Tower (Left) */}
            <g transform="translate(190, 420)">
              {/* Spire */}
              <line x1="25" y1="0" x2="25" y2="40" stroke="#0284c7" strokeWidth="2.5" />
              {/* Tower Body */}
              <path
                d="M 25,40 L 16,110 L 8,175 L 2,190 L 14,190 L 18,175 L 22,125 L 28,125 L 32,175 L 36,190 L 48,190 L 42,175 L 34,110 Z"
                fill="url(#landmarksFade)"
              />
              {/* Arch */}
              <path
                d="M 18,175 Q 25,145 32,175 Z"
                fill="#e0f2fe"
              />
            </g>

            {/* Landmark 2: Leaning Tower of Pisa */}
            <g transform="translate(360, 440) rotate(-6)">
              <rect x="0" y="0" width="34" height="150" rx="3" fill="url(#landmarksFade)" />
              {/* Columns & tiers */}
              <line x1="0" y1="30" x2="34" y2="30" stroke="#bae6fd" strokeWidth="2" />
              <line x1="0" y1="60" x2="34" y2="60" stroke="#bae6fd" strokeWidth="2" />
              <line x1="0" y1="90" x2="34" y2="90" stroke="#bae6fd" strokeWidth="2" />
              <line x1="0" y1="120" x2="34" y2="120" stroke="#bae6fd" strokeWidth="2" />
              <rect x="5" y="-14" width="24" height="14" rx="2" fill="url(#landmarksFade)" />
            </g>

            {/* Landmark 3: Taj Mahal (Center) */}
            <g transform="translate(630, 445)">
              {/* Main Central Dome */}
              <path
                d="M 60,70 C 60,35 75,10 90,0 C 105,10 120,35 120,70 Z"
                fill="url(#landmarksFade)"
              />
              <line x1="90" y1="0" x2="90" y2="-12" stroke="#0284c7" strokeWidth="2" />
              {/* Main Building Body */}
              <rect x="45" y="70" width="90" height="90" fill="url(#landmarksFade)" />
              {/* Central Arch */}
              <path d="M 68,160 L 68,105 Q 90,85 112,105 L 112,160 Z" fill="#e0f2fe" />
              {/* Left Minaret */}
              <rect x="15" y="30" width="10" height="130" fill="url(#landmarksFade)" />
              <path d="M 15,30 Q 20,15 25,30 Z" fill="url(#landmarksFade)" />
              {/* Right Minaret */}
              <rect x="155" y="30" width="10" height="130" fill="url(#landmarksFade)" />
              <path d="M 155,30 Q 160,15 165,30 Z" fill="url(#landmarksFade)" />
            </g>

            {/* Landmark 4: Asian Pagoda (Temple) */}
            <g transform="translate(890, 455)">
              {/* Spire */}
              <line x1="45" y1="0" x2="45" y2="25" stroke="#0284c7" strokeWidth="2" />
              {/* Tier 1 Roof */}
              <path d="M 15,40 Q 45,30 75,40 L 70,48 L 20,48 Z" fill="url(#landmarksFade)" />
              <rect x="30" y="48" width="30" height="18" fill="url(#landmarksFade)" />
              {/* Tier 2 Roof */}
              <path d="M 8,75 Q 45,62 82,75 L 76,84 L 14,84 Z" fill="url(#landmarksFade)" />
              <rect x="25" y="84" width="40" height="22" fill="url(#landmarksFade)" />
              {/* Tier 3 Roof */}
              <path d="M 0,115 Q 45,98 90,115 L 84,126 L 6,126 Z" fill="url(#landmarksFade)" />
              <rect x="20" y="126" width="50" height="35" fill="url(#landmarksFade)" />
            </g>

            {/* Landmark 5: Statue of Liberty (Right) */}
            <g transform="translate(1260, 430)">
              {/* Torch */}
              <circle cx="10" cy="5" r="3" fill="#f97316" opacity="0.85" />
              <line x1="10" y1="5" x2="16" y2="35" stroke="#0284c7" strokeWidth="2.5" />
              {/* Head & Crown */}
              <circle cx="28" cy="40" r="8" fill="url(#landmarksFade)" />
              <path d="M 22,35 L 18,28 M 25,33 L 24,25 M 28,32 L 28,24 M 31,33 L 32,25 M 34,35 L 38,28" stroke="#0284c7" strokeWidth="1.5" />
              {/* Body & Robes */}
              <path d="M 18,48 L 12,145 L 42,145 L 38,48 Z" fill="url(#landmarksFade)" />
              {/* Pedestal */}
              <rect x="8" y="145" width="38" height="35" fill="url(#landmarksFade)" />
            </g>

            {/* Landmark 6: Asian Shrine / Pagoda (Far Right) */}
            <g transform="translate(1440, 465)">
              <line x1="30" y1="5" x2="30" y2="25" stroke="#0284c7" strokeWidth="2" />
              <path d="M 10,40 Q 30,30 50,40 L 46,48 L 14,48 Z" fill="url(#landmarksFade)" />
              <rect x="20" y="48" width="20" height="20" fill="url(#landmarksFade)" />
              <path d="M 2,75 Q 30,62 58,75 L 54,84 L 6,84 Z" fill="url(#landmarksFade)" />
              <rect x="15" y="84" width="30" height="30" fill="url(#landmarksFade)" />
            </g>
          </g>
        )}
      </svg>
    </div>
  );
}
