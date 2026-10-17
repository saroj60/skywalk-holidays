"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  MapPin,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Sparkles,
  Phone,
  ArrowRight,
  Share2,
  Check,
  Palmtree,
  Users,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildCustomWhatsAppLink } from "@/lib/whatsapp";

const GALLERY_HIGHLIGHT_CARDS = [
  {
    icon: Camera,
    title: "50+ Curated Photos",
    subtitle: "Real Moments",
    desc: "Captured on tours by travelers",
    color: "bg-[#e0f2fe] text-[#0ea5e9]",
    categoryId: "all",
  },
  {
    icon: Palmtree,
    title: "Island & Beach",
    subtitle: "Bali & Thailand",
    desc: "Villas, reefs & emerald waters",
    color: "bg-[#f0fdf4] text-emerald-600",
    categoryId: "bali",
  },
  {
    icon: Compass,
    title: "City Skylines",
    subtitle: "Malaysia & Singapore",
    desc: "Twin Towers & Marina Bay",
    color: "bg-[#fff7ed] text-[#f97316]",
    categoryId: "malaysia",
  },
  {
    icon: Users,
    title: "Happy Travelers",
    subtitle: "Authentic Journeys",
    desc: "Memories created worldwide",
    color: "bg-[#faf5ff] text-purple-600",
    categoryId: "travelers",
  },
];

const CATEGORIES = [
  { id: "all", label: "All Photos" },
  { id: "thailand", label: "Thailand Tours 🇹🇭" },
  { id: "vietnam", label: "Vietnam Tours 🇻🇳" },
  { id: "bali", label: "Bali Tours 🌴" },
  { id: "malaysia", label: "Malaysia & Singapore 🇲🇾🇸🇬" },
  { id: "maldives", label: "Maldives 🇲🇻" },
  { id: "philippines", label: "Philippines 🇵🇭" },
  { id: "srilanka", label: "Sri Lanka Tours 🇱🇰" },
  { id: "travelers", label: "Happy Travelers" },
  { id: "destinations", label: "Destinations" },
  { id: "resorts", label: "Luxury Resorts" },
  { id: "flights", label: "Flight Experiences" },
];

const GALLERY_ITEMS = [
  {
    id: 735,
    title: "Explore Vietnam — Wonders of Halong Bay, Sapa Fansipan & Hoi An",
    location: "Hanoi, Ha Long Bay, Da Nang & Hoi An, Vietnam",
    category: "vietnam",
    categoryLabel: "Vietnam Tours",
    image: "/images/gallery/vietnam-highlights-collage-card.png",
    description: "Spectacular collage showcasing Vietnam's most iconic wonders: emerald Ha Long Bay junk boats, misty Fansipan peak, Ba Na Hills Golden Hands Bridge, and lantern-lit Hoi An Ancient Town.",
    date: "September 2025",
  },
  {
    id: 713,
    title: "SkyWalk Tours & Travels Official Group Banner",
    location: "Southeast Asia Group Tour",
    category: "travelers",
    categoryLabel: "Happy Travelers",
    image: "/images/gallery/skywalk-happy-tourists-group-banner.png",
    description: "Our wonderful SkyWalk travelers group gathered proudly with the official company banner featuring international flights and customized travel packages.",
    date: "July 2025",
  },
  {
    id: 714,
    title: "Suvarnabhumi Airport Meet & Greet Welcome Board",
    location: "Suvarnabhumi Airport (BKK), Bangkok",
    category: "travelers",
    categoryLabel: "Happy Travelers",
    image: "/images/gallery/skywalk-suvarnabhumi-arrival-pickup-welcome-plaza.png",
    description: "Personalized meet-and-greet reception for RA 401 flight travelers arriving from Kathmandu for direct private transfer to Welcome Plaza Hotel Pattaya.",
    date: "July 2025",
  },
  {
    id: 715,
    title: "Crystal Lagoon Speedboat & Coral Reef Snorkel",
    location: "Coral Island (Koh Larn), Thailand",
    category: "thailand",
    categoryLabel: "Thailand Tours",
    image: "/images/gallery/thailand-coral-reef-speedboat-snorkel-split.png",
    description: "Stunning over-under split view of our excursion speedboat gliding above pristine coral gardens and turquoise tropical waters.",
    date: "July 2025",
  },
  {
    id: 716,
    title: "Grand Palace Royal Golden Pavilion & Spire",
    location: "Grand Palace & Wat Phra Kaew, Bangkok",
    category: "thailand",
    categoryLabel: "Thailand Tours",
    image: "/images/gallery/bangkok-grand-palace-royal-golden-pavilion.png",
    description: "Intricate Thai royal architecture, multi-tiered carved eaves, and golden chedi spires under morning skies in Bangkok.",
    date: "July 2025",
  },
  {
    id: 717,
    title: "Marina Bay Sunset Panorama from SkyPark",
    location: "Marina Bay, Singapore",
    category: "destinations",
    categoryLabel: "Destinations",
    image: "/images/gallery/singapore-marina-bay-aerial-sunset-skyline.png",
    description: "Spectacular elevated golden hour panorama overlooking Marina Bay waterfront promenade, floating Apple dome, and illuminated Singapore skyscrapers.",
    date: "August 2025",
  },
  {
    id: 718,
    title: "Sentosa Island Cable Car & Waterpark Aerial View",
    location: "Sentosa Island, Singapore",
    category: "malaysia",
    categoryLabel: "Malaysia & Singapore",
    image: "/images/gallery/singapore-sentosa-cable-car-adventure-cove.png",
    description: "Panoramic cable car cabin ride soaring high above Adventure Cove Waterpark and lush tropical rainforest toward Sentosa Island.",
    date: "August 2025",
  },
  {
    id: 719,
    title: "Petronas Twin Towers & Saloma Link Bridge",
    location: "Kuala Lumpur, Malaysia",
    category: "malaysia",
    categoryLabel: "Malaysia & Singapore",
    image: "/images/gallery/malaysia-petronas-twin-towers-saloma-bridge.png",
    description: "Futuristic architecture of the Saloma Link pedestrian walkway framing the iconic 88-storey Petronas Twin Towers soaring into blue skies.",
    date: "August 2025",
  },
  {
    id: 720,
    title: "Batu Caves Golden Murugan & Rainbow Steps",
    location: "Batu Caves, Selangor, Malaysia",
    category: "malaysia",
    categoryLabel: "Malaysia & Singapore",
    image: "/images/gallery/malaysia-batu-caves-murugan-rainbow-stairs.png",
    description: "The magnificent 140-foot golden Lord Murugan statue standing proudly before the vibrant 272 rainbow steps leading into historic limestone cave temples.",
    date: "August 2025",
  },
  {
    id: 721,
    title: "Petronas Twin Towers & KLCC Symphony Park",
    location: "KLCC, Kuala Lumpur, Malaysia",
    category: "malaysia",
    categoryLabel: "Malaysia & Singapore",
    image: "/images/gallery/malaysia-klcc-petronas-twin-towers-park.png",
    description: "Sunlit view of the world-famous Petronas Twin Towers rising above lush tropical greenery, pedestrian bridge, and fountains at KLCC Park.",
    date: "August 2025",
  },
  {
    id: 722,
    title: "Flight Above the Clouds — Jetliner Wing Window View",
    location: "International Flight (Kathmandu - Bangkok - Singapore)",
    category: "flights",
    categoryLabel: "Flight Experiences",
    image: "/images/gallery/skywalk-flight-window-skyline-wing-clouds.png",
    description: "Breathtaking aircraft passenger window view looking out at the aircraft wing and cotton-white clouds cruising high above tropical lands.",
    date: "August 2025",
  },
  {
    id: 723,
    title: "Sigiriya Ancient Lion Rock Fortress & Water Gardens",
    location: "Sigiriya, Central Province, Sri Lanka",
    category: "srilanka",
    categoryLabel: "Sri Lanka Tours",
    image: "/images/gallery/sri-lanka-sigiriya-lion-rock-fortress.jpg",
    description: "The dramatic UNESCO World Heritage 5th-century rock citadel rising 200 meters above tropical jungle forests and landscaped water gardens.",
    date: "August 2025",
  },
  {
    id: 724,
    title: "Demodara Nine Arches Bridge & Scenic Hill Train",
    location: "Ella, Hill Country, Sri Lanka",
    category: "srilanka",
    categoryLabel: "Sri Lanka Tours",
    image: "/images/gallery/sri-lanka-ella-nine-arches-bridge.jpg",
    description: "The legendary stone viaduct nestled amid lush emerald tea plantations and misty highlands, famous for scenic train crossings.",
    date: "August 2025",
  },
  {
    id: 725,
    title: "Galle Dutch Fort Ramparts & Historic Lighthouse",
    location: "Galle, Southern Coast, Sri Lanka",
    category: "srilanka",
    categoryLabel: "Sri Lanka Tours",
    image: "/images/gallery/sri-lanka-galle-dutch-fort-lighthouse.jpg",
    description: "17th-century colonial stone ramparts and gleaming white lighthouse overlooking the turquoise swells of the Indian Ocean.",
    date: "August 2025",
  },
  {
    id: 726,
    title: "Ba Na Hills Golden Giant Hands Bridge",
    location: "Da Nang, Vietnam",
    category: "vietnam",
    categoryLabel: "Vietnam Tours",
    image: "/images/gallery/vietnam-danang-golden-bridge-hands.jpg",
    description: "Colossal stone hands holding a golden pedestrian bridge suspended among mist and clouds high above the Da Nang mountains.",
    date: "August 2025",
  },
  {
    id: 727,
    title: "Hoi An Ancient Lantern Town & Thu Bon River",
    location: "Hoi An, Central Vietnam",
    category: "vietnam",
    categoryLabel: "Vietnam Tours",
    image: "/images/gallery/vietnam-hoi-an-lantern-night-river.jpg",
    description: "Magical night scenery of hundreds of glowing silk lanterns illuminating historic merchant wooden shophouses and traditional wooden sampans.",
    date: "August 2025",
  },
  {
    id: 728,
    title: "Wat Arun Temple of Dawn at Chao Phraya River",
    location: "Bangkok, Thailand",
    category: "thailand",
    categoryLabel: "Thailand Tours",
    image: "/images/gallery/thailand-bangkok-wat-arun-temple-dawn.jpg",
    description: "Iconic Khmer-style prang spires encrusted with colorful porcelain mosaics rising majestically on the banks of the Chao Phraya River.",
    date: "August 2025",
  },
  {
    id: 729,
    title: "Phuket White Marble Big Buddha & Chalong Bay View",
    location: "Nakkerd Hill, Phuket, Thailand",
    category: "thailand",
    categoryLabel: "Thailand Tours",
    image: "/images/gallery/thailand-phuket-big-buddha-marble.jpg",
    description: "The revered 45-meter tall white Burmese marble Buddha statue sitting atop Nakkerd Hill with 360-degree views of southern Phuket.",
    date: "August 2025",
  },
  {
    id: 730,
    title: "Ulun Danu Beratan Water Temple on Lake Bratan",
    location: "Bedugul Highlands, Bali",
    category: "bali",
    categoryLabel: "Bali Tours",
    image: "/images/gallery/bali-ulun-danu-beratan-water-temple.jpg",
    description: "Iconic multi-tiered Hindu-Buddhist water temple floating gracefully on misty mountain lake waters in central Bali.",
    date: "August 2025",
  },
  {
    id: 731,
    title: "Ubud Tegalalang Rice Terraces & Jungle Valley",
    location: "Ubud, Bali, Indonesia",
    category: "bali",
    categoryLabel: "Bali Tours",
    image: "/images/gallery/bali-tegalalang-rice-terrace-swing.jpg",
    description: "Steep cascading emerald green subak rice terraces and tropical palm canopies in the cultural heart of Ubud.",
    date: "August 2025",
  },
  {
    id: 732,
    title: "Genting Highlands Awana SkyWay Cable Car",
    location: "Genting Highlands, Pahang, Malaysia",
    category: "malaysia",
    categoryLabel: "Malaysia & Singapore",
    image: "/images/gallery/malaysia-genting-highlands-cable-car.jpg",
    description: "Spectacular glass-floor cable car gliding through clouds and misty rainforest up to Resorts World Genting.",
    date: "August 2025",
  },
  {
    id: 101,
    title: "SkyWalk Group Tour in Thailand",
    location: "Bangkok & Pattaya, Thailand",
    category: "travelers",
    categoryLabel: "Happy Travelers",
    image: "/images/gallery/skywalk-group-tour.png",
    description: "Our happy group of Nepali travelers on tour in Thailand proudly holding the SkyWalk Tours & Travels banner.",
    date: "July 2025",
  },
  {
    id: 102,
    title: "VIP Airport Meet & Greet Service",
    location: "Suvarnabhumi Airport (BKK), Bangkok",
    category: "flights",
    categoryLabel: "Flight & Arrival",
    image: "/images/gallery/bangkok-airport-pickup.png",
    description: "Dedicated airport welcome board and private transfer for Nepal Airlines RA 401 passengers arriving at Bangkok for Welcome Plaza Pattaya.",
    date: "July 2025",
  },
  {
    id: 103,
    title: "Coral Island Speedboat Tour & Crystal Lagoon",
    location: "Coral Island (Koh Larn), Pattaya",
    category: "destinations",
    categoryLabel: "Destinations",
    image: "/images/gallery/coral-island-speedboat.png",
    description: "Crystal-clear turquoise waters and speedboat ride during our Day 2 Coral Island excursion with Indian buffet lunch.",
    date: "July 2025",
  },
  {
    id: 104,
    title: "Sanctuary of Truth Hand-Carved Wooden Temple",
    location: "Pattaya, Thailand",
    category: "destinations",
    categoryLabel: "Destinations",
    image: "/images/gallery/sanctuary-of-truth-pattaya.png",
    description: "Awe-inspiring all-wood architectural masterpiece in Pattaya visited during our Pattaya City exploration.",
    date: "July 2025",
  },
  {
    id: 105,
    title: "Grand Palace & Royal Pavilion Sightseeing",
    location: "Bangkok, Thailand",
    category: "destinations",
    categoryLabel: "Destinations",
    image: "/images/gallery/bangkok-grand-palace.png",
    description: "Magnificent golden stupas and sacred royal temple pavilions during our guided Bangkok cultural tour.",
    date: "July 2025",
  },
  {
    id: 106,
    title: "Vibrant Nightlife at Pattaya Walking Street",
    location: "Walking Street, Pattaya, Thailand",
    category: "destinations",
    categoryLabel: "Destinations",
    image: "/images/gallery/pattaya-walking-street.png",
    description: "Electric atmosphere, iconic neon lights, music, and bustling nightlife experience along Pattaya's famous Walking Street.",
    date: "July 2025",
  },
  {
    id: 107,
    title: "Scenic Flight In-Air Window View",
    location: "Kathmandu ⇄ Bangkok Route",
    category: "flights",
    categoryLabel: "Flight & Arrival",
    image: "/images/gallery/flight-window-view.png",
    description: "Clear blue skies and cloudscape wing view during the international flight between Kathmandu and Bangkok.",
    date: "July 2025",
  },
  {
    id: 108,
    title: "Kelingking Beach & T-Rex Cliff Coastal View",
    location: "Nusa Penida, Bali",
    category: "destinations",
    categoryLabel: "Destinations",
    image: "/images/gallery/bali-kelingking-beach.jpg",
    description: "Iconic T-Rex shaped cliff and turquoise ocean lagoon captured during our Bali island exploration.",
    date: "July 2025",
  },
  {
    id: 109,
    title: "Mount Batur Active Volcano & Kintamani Highlands",
    location: "Kintamani, Bali",
    category: "destinations",
    categoryLabel: "Destinations",
    image: "/images/gallery/bali-mount-batur-kintamani.png",
    description: "Panoramic crater and mountain ridge vistas during the Day 2 Kintamani volcano tour with Luwak coffee tasting.",
    date: "July 2025",
  },
  {
    id: 110,
    title: "Tegalalang Cascading Rice Terraces in Morning Mist",
    location: "Ubud, Bali",
    category: "destinations",
    categoryLabel: "Destinations",
    image: "/images/gallery/bali-rice-terraces-mist.png",
    description: "Breathtaking layered rice terraces reflecting the morning sky and mountain mist in central Bali.",
    date: "July 2025",
  },
  {
    id: 111,
    title: "Scenic Emerald Ubud Rice Terraces & Palm Canopies",
    location: "Ubud, Bali",
    category: "destinations",
    categoryLabel: "Destinations",
    image: "/images/gallery/bali-tegalalang-ubud.png",
    description: "Lush green agricultural terraces and palm groves visited during our cultural exploration in Ubud.",
    date: "July 2025",
  },
  {
    id: 112,
    title: "Ngurah Rai International Airport Arrival Terminal",
    location: "Denpasar, Bali",
    category: "flights",
    categoryLabel: "Flight & Arrival",
    image: "/images/gallery/bali-airport-terminal.png",
    description: "Traditional Balinese temple architecture blended into the modern arrival terminal where our team meets travelers.",
    date: "July 2025",
  },
  {
    id: 113,
    title: "Batu Caves Rainbow Steps & Golden Lord Murugan",
    location: "Selangor / Kuala Lumpur, Malaysia",
    category: "destinations",
    categoryLabel: "Destinations",
    image: "/images/gallery/malaysia-batu-caves.jpg",
    description: "The monumental 140-foot golden Lord Murugan statue and 272 vibrant rainbow stairs leading into the sacred limestone cave shrines.",
    date: "July 2025",
  },
  {
    id: 114,
    title: "Petronas Twin Towers & KLCC Park Panorama",
    location: "Kuala Lumpur, Malaysia",
    category: "destinations",
    categoryLabel: "Destinations",
    image: "/images/gallery/malaysia-petronas-towers.jpg",
    description: "The soaring 88-story twin skyscrapers and skybridge framed by the lush tropical gardens and fountains of KLCC Park.",
    date: "July 2025",
  },
  {
    id: 115,
    title: "International Flight Operations & Air Travel",
    location: "Kathmandu ⇄ Malaysia / Bali Network",
    category: "flights",
    categoryLabel: "Flight & Arrival",
    image: "/images/gallery/malindo-air-flight.png",
    description: "Reliable international airline partner flights providing smooth connectivity between Nepal, Malaysia, and Bali.",
    date: "July 2025",
  },
  {
    id: 116,
    title: "Golden Hour Sunrise Over Balinese Terraced Valley",
    location: "Ubud & Tabanan, Bali",
    category: "destinations",
    categoryLabel: "Destinations",
    image: "/images/gallery/bali-terraces-sunrise-mist.png",
    description: "Spectacular morning sunbeams breaking through misty mountain clouds across lush cascading rice terraces.",
    date: "July 2025",
  },
  {
    id: 117,
    title: "Maya Bay & Phi Phi Islands Lagoon",
    location: "Phi Phi Islands, Thailand",
    category: "destinations",
    categoryLabel: "Destinations",
    image: "/images/gallery/thailand-phi-phi-maya-bay.png",
    description: "Towering karst limestone cliffs framing emerald lagoons and wooden longtail boats in Maya Bay, Thailand.",
    date: "July 2025",
  },
  {
    id: 118,
    title: "Iconic Pattaya City Hilltop Landmark",
    location: "Pratumnak Hill, Pattaya, Thailand",
    category: "destinations",
    categoryLabel: "Destinations",
    image: "/images/gallery/pattaya-city-hill-sign.png",
    description: "The panoramic Pattaya City sign overlooking Bali Hai Pier and the vibrant coastal waters of the Gulf of Thailand.",
    date: "July 2025",
  },
  {
    id: 119,
    title: "Maldives Luxury Overwater Villas & Lagoon",
    location: "North Malé Atoll, Maldives",
    category: "resorts",
    categoryLabel: "Luxury Resorts",
    image: "/images/gallery/maldives-overwater-villas-lagoon.jpg",
    description: "Aerial panorama of luxury stilt bungalows, white-sand atoll beaches, and crystal turquoise waters in the Maldives.",
    date: "July 2025",
  },
  {
    id: 120,
    title: "Royal Barge Suphannahong Heritage Exhibition",
    location: "Royal Plaza, Bangkok, Thailand",
    category: "destinations",
    categoryLabel: "Destinations",
    image: "/images/gallery/bangkok-royal-barge-palace.png",
    description: "Ornate gold-gilded Thai Royal Barge ceremonial float surrounded by flower displays at Bangkok's royal palace grounds.",
    date: "July 2025",
  },
  {
    id: 121,
    title: "Andaman Sea Island Cruise & Karst Formations",
    location: "Krabi & Andaman Coast, Thailand",
    category: "travelers",
    categoryLabel: "Happy Travelers",
    image: "/images/gallery/thailand-krabi-island-boat.jpg",
    description: "Traveler enjoying the warm tropical ocean breeze and dramatic island cliffs aboard a traditional Thai longtail cruise.",
    date: "July 2025",
  },
  {
    id: 122,
    title: "SkyWalk Travelers at Pattaya City Hill Sign",
    location: "Pattaya City Hilltop, Thailand",
    category: "travelers",
    categoryLabel: "Happy Travelers",
    image: "/images/gallery/skywalk-group-pattaya-city-sign.png",
    description: "Our happy group of Nepalese travelers posing proudly with the SkyWalk Tours & Travels banner in front of the iconic Pattaya City landmark.",
    date: "July 2025",
  },
  {
    id: 123,
    title: "SkyWalk Family Arrival & Airport Reception",
    location: "Bangkok International Airport (BKK), Thailand",
    category: "travelers",
    categoryLabel: "Happy Travelers",
    image: "/images/gallery/skywalk-family-airport-welcome.png",
    description: "Warm airport welcome and meet-and-greet reception for our traveling families holding the official SkyWalk Holidays welcome board in Bangkok.",
    date: "July 2025",
  },
  {
    id: 124,
    title: "Coral Island Platinum Speedboat Cruise",
    location: "Coral Island (Koh Larn), Pattaya, Thailand",
    category: "destinations",
    categoryLabel: "Destinations",
    image: "/images/gallery/pattaya-coral-island-platinum-speedboat.jpg",
    description: "High-speed boat 'The Island Platinum' cruising across turquoise waters towards Coral Island with white sandy beaches and hills.",
    date: "July 2025",
  },
  {
    id: 125,
    title: "Loha Prasat Wat Ratchanatdaram Golden Temple",
    location: "Bangkok, Thailand",
    category: "destinations",
    categoryLabel: "Destinations",
    image: "/images/gallery/bangkok-loha-prasat-golden-temple.jpg",
    description: "The striking multi-tiered white and golden metal castle spires of Loha Prasat temple in Bangkok, Thai Buddhist architectural marvel.",
    date: "July 2025",
  },
  {
    id: 126,
    title: "Scenic Aerial Flight Approach Over Tropical Phuket",
    location: "Phuket Coastal Flight Path, Thailand",
    category: "flights",
    categoryLabel: "Flight Experiences",
    image: "/images/gallery/phuket-flight-landing-wing-view.png",
    description: "Spectacular aircraft wing view banking over Mai Khao beach and tropical forested hills on final approach into Phuket International Airport.",
    date: "July 2025",
  },
  {
    id: 127,
    title: "Big Buddha Wat Phra Yai & Lotus Candle Shrine",
    location: "Pratumnak Hill, Pattaya, Thailand",
    category: "destinations",
    categoryLabel: "Destinations",
    image: "/images/gallery/pattaya-big-buddha-wat-phra-yai.jpg",
    description: "The revered giant golden Buddha of Wat Phra Yai overlooking Pattaya, with colorful floating lotus candles and prayer shrine in the foreground.",
    date: "July 2025",
  },
  {
    id: 128,
    title: "Wat Phra Kaew Giant Yaksha Demon Guardian",
    location: "Grand Palace, Bangkok, Thailand",
    category: "destinations",
    categoryLabel: "Destinations",
    image: "/images/gallery/bangkok-grand-palace-yaksha-guardian.png",
    description: "Towering mythical Yaksha warrior demon guardian in ornate gold and glazed mosaic armor protecting the sacred grounds of Wat Phra Kaew.",
    date: "July 2025",
  },
  {
    id: 129,
    title: "SkyWalk Travelers Tour Group with Official Banner",
    location: "Thailand Holiday Tour, Bangkok & Pattaya",
    category: "travelers",
    categoryLabel: "Happy Travelers",
    image: "/images/gallery/skywalk-travelers-group-banner-tour.png",
    description: "Our wonderful group of Nepali travelers on tour in Thailand proudly displaying the SkyWalk Tours and Travels company banner.",
    date: "July 2025",
  },
  {
    id: 130,
    title: "Suvarnabhumi Airport Meet & Greet Group Arrival",
    location: "Suvarnabhumi Airport (BKK), Bangkok, Thailand",
    category: "travelers",
    categoryLabel: "Happy Travelers",
    image: "/images/gallery/skywalk-suvarnabhumi-arrival-group-pickup.png",
    description: "Our traveler group received with official SkyWalk personalized arrival placard for direct private coach transfer to Welcome Plaza Pattaya.",
    date: "July 2025",
  },
  {
    id: 131,
    title: "Crystal Reef Snorkeling & Speedboat Half-Underwater View",
    location: "Coral Island & Andaman Sea, Thailand",
    category: "destinations",
    categoryLabel: "Destinations",
    image: "/images/gallery/thailand-coral-reef-speedboat-snorkel.png",
    description: "Spectacular split-level underwater view of vibrant living coral reefs beneath crystal turquoise sea waters with a tour speedboat floating above.",
    date: "July 2025",
  },
  {
    id: 132,
    title: "Grand Palace Chakri Maha Prasat Throne Hall",
    location: "Grand Palace, Bangkok, Thailand",
    category: "destinations",
    categoryLabel: "Destinations",
    image: "/images/gallery/bangkok-grand-palace-chakri-hall.png",
    description: "The iconic blend of Italian Renaissance architecture and traditional Thai tiered golden roofs at the Chakri Maha Prasat in Bangkok's royal compound.",
    date: "July 2025",
  },
  {
    id: 133,
    title: "Traditional Longtail Boats at Maya Bay Lagoon",
    location: "Phi Phi Leh, Andaman Sea, Thailand",
    category: "destinations",
    categoryLabel: "Destinations",
    image: "/images/gallery/thailand-phi-phi-longtail-boats.jpg",
    description: "Classic wooden longtail boats resting along the powdery white sands and emerald-clear lagoon of world-famous Maya Bay.",
    date: "July 2025",
  },
  {
    id: 134,
    title: "SkyWalk Tours & Travels Traveler Group",
    location: "Kathmandu & Thailand International Tour",
    category: "travelers",
    categoryLabel: "Happy Travelers",
    image: "/images/gallery/skywalk-nepal-travelers-group-banner.png",
    description: "Our happy group of Nepali families and travelers holding the official SkyWalk Tours and Travels partner airline banner.",
    date: "July 2025",
  },
  {
    id: 135,
    title: "Suvarnabhumi Airport Meet & Greet Group Arrival",
    location: "Suvarnabhumi Airport (BKK), Bangkok, Thailand",
    category: "travelers",
    categoryLabel: "Happy Travelers",
    image: "/images/gallery/skywalk-suvarnabhumi-arrival-group-welcome.png",
    description: "Our travelers received with personalized flight RA 401 meet-and-greet pickup placard for direct transfer to Welcome Plaza Pattaya.",
    date: "July 2025",
  },
  {
    id: 136,
    title: "AirAsia Flight Above Cloudscape to Thailand",
    location: "In-Flight Cruising Altitude, South East Asia",
    category: "flights",
    categoryLabel: "Flight Experiences",
    image: "/images/gallery/airasia-flight-clouds-wing-view.png",
    description: "Serene aircraft window view of AirAsia red winglet soaring above a sea of fluffy white clouds and deep azure skies.",
    date: "July 2025",
  },
  {
    id: 137,
    title: "Andaman Sea Karst Passage & Emerald Lagoon",
    location: "Phi Phi Islands & Krabi, Thailand",
    category: "destinations",
    categoryLabel: "Destinations",
    image: "/images/gallery/thailand-andaman-limestone-lagoon-bay.png",
    description: "Dramatic towering limestone karst cliffs framing the tranquil turquoise waters and crystal passage of the Andaman Sea.",
    date: "July 2025",
  },
  {
    id: 138,
    title: "Railay Beach & Limestone Cliffs Aerial View",
    location: "Railay Beach, Krabi, Thailand",
    category: "destinations",
    categoryLabel: "Destinations",
    image: "/images/gallery/krabi-railay-beach-aerial-bay.jpg",
    description: "Panoramic high-angle view over emerald coastal waters, white sands, coconut palms, and towering limestone karsts in Krabi.",
    date: "July 2025",
  },
  {
    id: 139,
    title: "Phuket Coastal Approach & Runway Descent",
    location: "Mai Khao Beach & Phuket Airport, Thailand",
    category: "flights",
    categoryLabel: "Flight Experiences",
    image: "/images/gallery/phuket-airport-descent-wing-view.png",
    description: "Scenic window view banking over tropical forested hills and turquoise coastlines during final descent into Phuket.",
    date: "July 2025",
  },
  {
    id: 140,
    title: "Bangkok Shopping Hub & Big C Supercenter",
    location: "Ratchaprasong & Pratunam, Bangkok, Thailand",
    category: "destinations",
    categoryLabel: "Destinations",
    image: "/images/gallery/bangkok-ratchaprasong-big-c-shopping.jpg",
    description: "Vibrant Bangkok commercial center with colorful taxis, pedestrian skywalks, and premier retail hubs opposite CentralWorld.",
    date: "July 2025",
  },
  {
    id: 141,
    title: "Sunset In-Flight Wing View Above the Clouds",
    location: "International Air Corridor, Nepal ⇄ Thailand",
    category: "flights",
    categoryLabel: "Flight Experiences",
    image: "/images/gallery/airplane-window-sunset-clouds-wing.png",
    description: "Peaceful aircraft cabin window perspective capturing the wing spanning across soft twilight skies and rolling cloudscapes.",
    date: "July 2025",
  },
  {
    id: 142,
    title: "Petronas Twin Towers & Giant Malaysian Flag at Night",
    location: "Kuala Lumpur, Malaysia",
    category: "malaysia",
    categoryLabel: "Malaysia Tours 🇲🇾",
    image: "/images/gallery/malaysia-petronas-towers-flag-night.png",
    description: "Looking up at the architectural majesty of the illuminated Petronas Twin Towers with the giant national Malaysian flag draped across the skybridge facade at night.",
    date: "October 2025",
  },
  {
    id: 143,
    title: "Gardens by the Bay Conservatories & Supertree Night Illumination",
    location: "Marina Bay, Singapore",
    category: "destinations",
    categoryLabel: "Singapore Attractions 🇸🇬",
    image: "/images/gallery/singapore-gardens-by-the-bay-night-domes.png",
    description: "Spectacular aerial night perspective over Gardens by the Bay featuring the illuminated Flower Dome, Cloud Forest glass biomes, and Supertree Grove.",
    date: "October 2025",
  },
  {
    id: 144,
    title: "Marina Bay Sunset Golden Hour Skyline Panorama",
    location: "Downtown Core, Singapore",
    category: "destinations",
    categoryLabel: "Singapore Attractions 🇸🇬",
    image: "/images/gallery/singapore-marina-bay-sunset-skyline.png",
    description: "Sun setting over the Singapore skyline casting golden reflections across Marina Bay and modern architectural pavilions.",
    date: "October 2025",
  },
  {
    id: 145,
    title: "Marina Bay Sands & Downtown Singapore Night Skyline",
    location: "Marina Bay, Singapore",
    category: "destinations",
    categoryLabel: "Singapore Attractions 🇸🇬",
    image: "/images/gallery/singapore-marina-bay-sands-night-panorama.png",
    description: "Breathtaking night panorama of the iconic three-tower Marina Bay Sands hotel, illuminated city lights, and Singapore financial core.",
    date: "October 2025",
  },
  {
    id: 146,
    title: "Sentosa Island Scenic Skyway Cable Car Over Singapore Harbor",
    location: "Sentosa Island, Singapore",
    category: "destinations",
    categoryLabel: "Singapore Attractions 🇸🇬",
    image: "/images/gallery/singapore-sentosa-island-cable-car.png",
    description: "Gliding across lush rainforest canopies, waterparks, and resort coastline aboard the scenic Sentosa Island Cable Car overlooking the Singapore Strait.",
    date: "October 2025",
  },
  {
    id: 147,
    title: "Maldives Luxury Overwater Bungalows & Turquoise Lagoon",
    location: "South Malé Atoll, Maldives",
    category: "resorts",
    categoryLabel: "Maldives Honeymoon 🇲🇻",
    image: "/images/gallery/maldives-overwater-bungalows-aerial-lagoon.png",
    description: "Aerial view of private overwater villas perched over the turquoise blue waters and coral reefs of the Maldives.",
    date: "October 2025",
  },
  {
    id: 148,
    title: "Maldivian Island Seaplane Docked on Azure Waters",
    location: "Hulhumalé & Atoll Transfer, Maldives",
    category: "flights",
    categoryLabel: "Maldives Transfers 🇲🇻",
    image: "/images/gallery/maldives-seaplane-dock-turquoise-lagoon.png",
    description: "Iconic red-and-white island seaplane anchored along the wooden resort pontoon ready for scenic island flight transfer.",
    date: "October 2025",
  },
  {
    id: 149,
    title: "Secluded Sandbank Paradise in Open Ocean",
    location: "Malé Atoll, Maldives",
    category: "destinations",
    categoryLabel: "Maldives Ocean Adventure 🇲🇻",
    image: "/images/gallery/maldives-isolated-sandbank-aerial-island.png",
    description: "Pristine white sandbank strip surrounded entirely by calm sapphire ocean waters visited during Day 2 sandbank excursion.",
    date: "October 2025",
  },
  {
    id: 150,
    title: "Vibrant Coral Reef & Tropical Fish Snorkeling",
    location: "Coral Reefs, Hulhumalé, Maldives",
    category: "destinations",
    categoryLabel: "Maldives Snorkeling 🇲🇻",
    image: "/images/gallery/maldives-coral-reef-tropical-fish-snorkel.png",
    description: "Underwater close-up of vivid tropical fish and flourishing coral formations illuminated by ocean sun rays.",
    date: "October 2025",
  },
  {
    id: 151,
    title: "Sunset Dolphin Cruise & Leaping Spinner Dolphins",
    location: "Open Atoll Waters, Maldives",
    category: "destinations",
    categoryLabel: "Maldives Dolphin Cruise 🇲🇻",
    image: "/images/gallery/maldives-sunset-dolphin-cruise-leap.png",
    description: "Golden sunset cruise across calm open waters with playful spinner dolphins leaping alongside the SkyWalk boat bow.",
    date: "October 2025",
  },
  {
    id: 152,
    title: "El Nido Palawan Limestone Karst & Emerald Lagoons",
    location: "El Nido, Palawan, Philippines",
    category: "destinations",
    categoryLabel: "Philippines Island Hopping 🇵🇭",
    image: "/images/gallery/philippines-el-nido-palawan-aerial-lagoon.png",
    description: "Dramatic aerial view of limestone islands, crystalline lagoons, and traditional bangka boats in El Nido, Palawan.",
    date: "November 2025",
  },
  {
    id: 153,
    title: "Manila International Airport Modern Terminal",
    location: "Ninoy Aquino International (MNL), Manila, Philippines",
    category: "flights",
    categoryLabel: "Airport & Flight 🇵🇭",
    image: "/images/gallery/manila-international-airport-terminal.png",
    description: "Sleek blue glass facade of Manila International Airport welcoming SkyWalk international travelers to the Philippine islands.",
    date: "November 2025",
  },
  {
    id: 154,
    title: "Boracay White Beach & Traditional Bangka Outrigger Boats",
    location: "Boracay Island, Philippines",
    category: "destinations",
    categoryLabel: "Philippines Island Hopping 🇵🇭",
    image: "/images/gallery/philippines-boracay-beach-bangka-boats.png",
    description: "Powdery white sandy shoreline, lush coastal palms, and traditional outrigger bangka boats moored in turquoise shallow waters.",
    date: "November 2025",
  },
  {
    id: 155,
    title: "High-Flying Ocean Parasailing Adventure",
    location: "Boracay Island, Philippines",
    category: "destinations",
    categoryLabel: "Boracay Adventure 🇵🇭",
    image: "/images/gallery/parasailing-ocean-adventure-flight.png",
    description: "Thrilling tandem parasailing flight high above the ocean with vibrant colorful canopy and panoramic open-sea views.",
    date: "November 2025",
  },
  {
    id: 156,
    title: "Scenic Aircraft Wing View Over Oceanic Clouds",
    location: "Kathmandu ⇄ Manila Route, Philippines",
    category: "flights",
    categoryLabel: "Philippines Flight 🇵🇭",
    image: "/images/gallery/airplane-wing-flight-clouds-sea.png",
    description: "Gliding high above white cumulus clouds and azure waters from the aircraft window during SkyWalk holiday journey.",
    date: "November 2025",
  },
  {
    id: 157,
    title: "Boracay White Beach & Iconic Surfboard under Coconut Palms",
    location: "White Beach, Boracay Island, Philippines",
    category: "destinations",
    categoryLabel: "Boracay White Beach 🇵🇭",
    image: "/images/gallery/boracay-white-beach-surfboard-palms.png",
    description: "Relaxing tropical vibe along Boracay's world-famous White Beach with colorful surfboard, coconut palm trees, and turquoise calm sea.",
    date: "November 2025",
  },
  {
    id: 158,
    title: "Maya Bay Turquoise Lagoon & Longtail Boats",
    location: "Phi Phi Leh, Phuket, Thailand",
    category: "destinations",
    categoryLabel: "Phuket & Phi Phi 🇹🇭",
    image: "/images/gallery/phuket-phi-phi-maya-bay-boats.png",
    description: "Traditional wooden longtail boats anchored in crystal-clear emerald waters beneath the towering limestone cliffs of iconic Maya Bay.",
    date: "July 2025",
  },
  {
    id: 159,
    title: "SkyWalk Holiday Travelers Group in Thailand",
    location: "Bangkok & Phuket, Thailand",
    category: "travelers",
    categoryLabel: "Happy Travelers",
    image: "/images/gallery/skywalk-thailand-tour-group-banner.png",
    description: "Our happy group of Nepali families and travelers on tour across Thailand holding the official SkyWalk Tours and Travels banner.",
    date: "July 2025",
  },
  {
    id: 160,
    title: "Suvarnabhumi Airport Meet & Greet Group Arrival",
    location: "Suvarnabhumi International Airport (BKK), Bangkok",
    category: "travelers",
    categoryLabel: "Happy Travelers",
    image: "/images/gallery/skywalk-bangkok-airport-pickup.png",
    description: "SkyWalk representative welcoming Nepal Airlines RA 401 travelers with personalized pickup board at Bangkok Airport for private hotel transfer.",
    date: "July 2025",
  },
  {
    id: 161,
    title: "AirAsia Flight Soaring Above Tropical Cloudscape",
    location: "In-Flight Cruising Altitude, Bangkok ⇄ Phuket Route",
    category: "flights",
    categoryLabel: "Flight Experiences",
    image: "/images/gallery/airasia-flight-clouds-wing.png",
    description: "Serene aircraft window view with AirAsia wingtip cruising smoothly above fluffy white clouds under deep blue skies.",
    date: "July 2025",
  },
  {
    id: 162,
    title: "Phi Phi Islands Dramatic Limestone Karsts & Lagoon",
    location: "Phi Phi Islands, Andaman Sea, Thailand",
    category: "destinations",
    categoryLabel: "Phuket & Phi Phi 🇹🇭",
    image: "/images/gallery/phuket-phi-phi-lagoon-cliffs.png",
    description: "Breathtaking towering sheer limestone cliffs rising dramatically out of vibrant turquoise ocean waters in the Andaman Sea.",
    date: "July 2025",
  },
  {
    id: 163,
    title: "Iconic Merlion Fountain & Marina Bay Financial Skyline",
    location: "Merlion Park, Marina Bay, Singapore",
    category: "malaysia",
    categoryLabel: "Singapore City Tour 🇸🇬",
    image: "/images/gallery/singapore-merlion-park-marina-bay.jpg",
    description: "The famous water-spouting Merlion statue overlooking Marina Bay against the glistening skyscraper towers of the central business district.",
    date: "July 2025",
  },
  {
    id: 164,
    title: "Singapore Airlines Airbus A350 Takeoff",
    location: "Changi Airport Flight Corridor, Singapore",
    category: "flights",
    categoryLabel: "Flight Experiences",
    image: "/images/gallery/singapore-airlines-flight-takeoff.png",
    description: "Flagship Singapore Airlines A350 passenger airliner climbing smoothly into sunny skies on international route from Changi.",
    date: "July 2025",
  },
  {
    id: 165,
    title: "Sentosa Skypark Bungee Jump & Tropical Coastline",
    location: "Siloso Beach, Sentosa Island, Singapore",
    category: "destinations",
    categoryLabel: "Sentosa Island Adventure 🇸🇬",
    image: "/images/gallery/singapore-sentosa-skypark-bungee-jump.png",
    description: "Adrenaline-pumping bungee jump over tropical coconut palms, white sand lagoons, and the open sea at Sentosa Island.",
    date: "July 2025",
  },
  {
    id: 166,
    title: "Gardens by the Bay Conservatories & Skyline Aerial View",
    location: "Marina Bay, Singapore",
    category: "destinations",
    categoryLabel: "Singapore City Tour 🇸🇬",
    image: "/images/gallery/singapore-gardens-by-the-bay-aerial-domes.png",
    description: "Stunning high-altitude panoramic view of the futuristic Flower Dome, Cloud Forest, Singapore Flyer, and Marina Bay.",
    date: "July 2025",
  },
  {
    id: 167,
    title: "Aircraft Cabin Porthole Window View on Runway Approach",
    location: "International Flight Corridor, Kathmandu ⇄ Singapore",
    category: "flights",
    categoryLabel: "Flight Experiences",
    image: "/images/gallery/airplane-window-porthole-wing-runway.png",
    description: "Classic oval airplane passenger window framing the wing poised over the runway beneath billowy summer cloudscapes.",
    date: "July 2025",
  },
  {
    id: 168,
    title: "Colombo City Skyline & Lotus Tower Panorama",
    location: "Colombo, Sri Lanka",
    category: "srilanka",
    categoryLabel: "Sri Lanka Tours 🇱🇰",
    image: "/images/gallery/sri-lanka-colombo-lotus-tower-skyline.jpg",
    description: "Panoramic view over the capital city of Colombo with the Lotus Tower rising above Beira Lake and the Indian Ocean coast.",
    date: "November 2025",
  },
  {
    id: 169,
    title: "Gangaramaya Temple & Sacred Buddhist Relics",
    location: "Colombo, Sri Lanka",
    category: "srilanka",
    categoryLabel: "Sri Lanka Tours 🇱🇰",
    image: "/images/gallery/sri-lanka-colombo-gangaramaya-temple.jpg",
    description: "The famous Gangaramaya Temple in central Colombo featuring intricate brass carvings, stupas, and sacred Buddhist statues.",
    date: "November 2025",
  },
  {
    id: 170,
    title: "Galle Face Green Ocean Promenade & Coastline",
    location: "Galle Face, Colombo, Sri Lanka",
    category: "srilanka",
    categoryLabel: "Sri Lanka Tours 🇱🇰",
    image: "/images/gallery/sri-lanka-colombo-galle-face-ocean.jpg",
    description: "Ocean breeze and picturesque views of the Indian Ocean crashing against the historic seaside promenade of Galle Face Green in Colombo.",
    date: "November 2025",
  },
  {
    id: 171,
    title: "National Lion Flag of Sri Lanka Fluttering High",
    location: "Colombo, Sri Lanka",
    category: "srilanka",
    categoryLabel: "Sri Lanka Tours 🇱🇰",
    image: "/images/gallery/sri-lanka-national-flag-flying-sky.png",
    description: "The iconic golden lion flag of Sri Lanka fluttering proudly against vibrant blue skies and summer clouds.",
    date: "November 2025",
  },
  {
    id: 172,
    title: "Grand Palace Wat Phra Kaew Giant Yaksha Demon Guardian",
    location: "Grand Palace, Bangkok, Thailand",
    category: "thailand",
    categoryLabel: "Bangkok Cultural Tour 🇹🇭",
    image: "/images/gallery/bangkok-wat-phra-kaew-giant-yaksha.png",
    description: "Majestic giant mythical Yaksha warrior demon guardian in intricate gold and turquoise armor guarding the sacred grounds of Wat Phra Kaew.",
    date: "July 2025",
  },
  {
    id: 173,
    title: "SkyWalk Holiday Travelers Group with Official Banner",
    location: "Thailand & Sri Lanka International Tour",
    category: "travelers",
    categoryLabel: "Happy Travelers",
    image: "/images/gallery/skywalk-thailand-sri-lanka-tour-group.png",
    description: "Our happy group of Nepali travelers on tour holding the official SkyWalk Tours and Travels company banner with partner airlines.",
    date: "July 2025",
  },
  {
    id: 174,
    title: "Suvarnabhumi Airport Meet & Greet for Welcome Plaza Transfer",
    location: "Suvarnabhumi Airport (BKK), Bangkok, Thailand",
    category: "travelers",
    categoryLabel: "Happy Travelers",
    image: "/images/gallery/skywalk-suvarnabhumi-welcome-plaza-pickup.png",
    description: "SkyWalk representative welcoming Nepal Airlines RA 401 travelers with personalized pickup board at Bangkok Airport for private transfer to Welcome Plaza Pattaya.",
    date: "July 2025",
  },
  {
    id: 175,
    title: "Coral Island Speedboat Split-Level Underwater Coral Reef",
    location: "Coral Island (Koh Larn), Pattaya, Thailand",
    category: "destinations",
    categoryLabel: "Coral Island Adventure 🇹🇭",
    image: "/images/gallery/thailand-coral-island-speedboat-split-reef.png",
    description: "Dramatic split-level view of tour speedboat cruising across emerald waters with living coral reefs and tropical marine life flourishing beneath.",
    date: "July 2025",
  },
  {
    id: 176,
    title: "Sanctuary of Truth Seaside Hand-Carved Teak Temple",
    location: "Pattaya Coast, Thailand",
    category: "thailand",
    categoryLabel: "Pattaya Exploration 🇹🇭",
    image: "/images/gallery/pattaya-sanctuary-of-truth-teak-temple.png",
    description: "Spectacular high-angle view of the all-wood Sanctuary of Truth rising majestically over lush tropical greenery by the Pattaya sea.",
    date: "July 2025",
  },
  {
    id: 177,
    title: "Grand Palace Wat Phra Kaew Golden Tiered Pavilion",
    location: "Grand Palace, Bangkok, Thailand",
    category: "thailand",
    categoryLabel: "Bangkok Cultural Tour 🇹🇭",
    image: "/images/gallery/bangkok-grand-palace-golden-pavilion.png",
    description: "Intricate gilded multi-tiered roof spires and traditional Thai royal architecture inside the Grand Palace complex in Bangkok.",
    date: "July 2025",
  },
  {
    id: 178,
    title: "Sri Lankan Flag & Modern Colombo Coastal High-Rises",
    location: "Colombo Waterfront, Sri Lanka",
    category: "srilanka",
    categoryLabel: "Sri Lanka Tours 🇱🇰",
    image: "/images/gallery/sri-lanka-colombo-flag-skyscrapers.png",
    description: "The national flag of Sri Lanka fluttering high against deep blue skies and the soaring modern waterfront skyline of Colombo.",
    date: "November 2025",
  },
  {
    id: 179,
    title: "Lotus Tower Rising Above Urban Colombo",
    location: "Colombo City Center, Sri Lanka",
    category: "srilanka",
    categoryLabel: "Sri Lanka Tours 🇱🇰",
    image: "/images/gallery/sri-lanka-colombo-lotus-tower-urban.png",
    description: "Colombo's iconic 350-meter Lotus Tower piercing the bright tropical skies above the city center buildings.",
    date: "November 2025",
  },
  {
    id: 180,
    title: "High-Altitude Flight Window View over Green Valleys",
    location: "International Air Corridor",
    category: "flights",
    categoryLabel: "Flight Experiences",
    image: "/images/gallery/airplane-window-flight-clouds-landscape.png",
    description: "Stunning passenger cabin window view over lush green valleys, rivers, and cumulus clouds from high cruising altitude.",
    date: "July 2025",
  },
  {
    id: 1,
    title: "Petronas Twin Towers & KLCC Park",
    location: "Kuala Lumpur, Malaysia",
    category: "destinations",
    categoryLabel: "Destinations",
    image: "/images/gallery/malaysia-petronas-towers-flag-night.png",
    description: "Spectacular evening illuminated view of the iconic Petronas Twin Towers and water fountains.",
    date: "August 2026",
  },
  {
    id: 2,
    title: "Bali Beach Sunset & Private Villa Pool",
    location: "Seminyak, Bali",
    category: "resorts",
    categoryLabel: "Luxury Resorts",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=85",
    description: "Relaxing sunset vibes at our partner 5-star beachfront resort in Seminyak, Bali.",
    date: "July 2026",
  },
  {
    id: 3,
    title: "Phuket Phi Phi Island Speedboat Adventure",
    location: "Phuket, Thailand",
    category: "destinations",
    categoryLabel: "Destinations",
    image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1200&q=85",
    description: "Crystal clear emerald waters and limestone cliff sightseeing on the Maya Bay tour.",
    date: "September 2026",
  },
  {
    id: 4,
    title: "Eiffel Tower Romantic Paris Evening",
    location: "Paris, France",
    category: "destinations",
    categoryLabel: "Destinations",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=85",
    description: "Illuminated Eiffel Tower captured during our popular 11-Day Grand Europe Tour.",
    date: "June 2026",
  },
  {
    id: 5,
    title: "Nepalese Family at Ba Na Hills Golden Bridge",
    location: "Da Nang, Vietnam",
    category: "travelers",
    categoryLabel: "Happy Travelers",
    image: "/images/gallery/vietnam-danang-golden-bridge-hands.jpg",
    description: "Unforgettable misty stroll along the world-famous giant hands bridge with our happy travelers.",
    date: "August 2026",
  },
  {
    id: 6,
    title: "Maldives Overwater Bungalow Villa",
    location: "Malé Atoll, Maldives",
    category: "resorts",
    categoryLabel: "Luxury Resorts",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200&q=85",
    description: "Direct ocean ladder access and glass floor panels in our top luxury Maldives honeymoon villa.",
    date: "August 2026",
  },
  {
    id: 7,
    title: "Tokyo Cherry Blossom & Mt. Fuji",
    location: "Tokyo & Hakone, Japan",
    category: "destinations",
    categoryLabel: "Destinations",
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&q=85",
    description: "Iconic Pagoda view with majestic Mount Fuji backdrop during peak Sakura season.",
    date: "April 2026",
  },
  {
    id: 8,
    title: "Singapore Marina Bay Sands SkyPark",
    location: "Singapore",
    category: "destinations",
    categoryLabel: "Destinations",
    image: "https://images.unsplash.com/photo-1565967511849-76a60a516170?w=1200&q=85",
    description: "Panoramic cityscape view from the 57th floor SkyPark observation deck in Singapore.",
    date: "May 2026",
  },
  {
    id: 9,
    title: "International Flight Departure",
    location: "Kathmandu TIA / Bangkok Suvarnabhumi",
    category: "flights",
    categoryLabel: "Flight Experiences",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=85",
    description: "Seamless flight booking experience with priority baggage allowance and comfortable legroom.",
    date: "September 2026",
  },
  {
    id: 10,
    title: "Bangkok Damnoen Saduak Floating Market",
    location: "Bangkok, Thailand",
    category: "destinations",
    categoryLabel: "Destinations",
    image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1200&q=85",
    description: "Vibrant longtail boat market ride sampling authentic Thai street food and fresh tropical fruits.",
    date: "July 2026",
  },
  {
    id: 12,
    title: "Luxury Beachfront Infinity Pool Sunset",
    location: "Koh Samui, Thailand",
    category: "resorts",
    categoryLabel: "Luxury Resorts",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=85",
    description: "5-star luxury resort amenities included in our premium Thailand island hopping package.",
    date: "June 2026",
  },
  {
    id: 701,
    title: "Halong Bay Luxury Cruise & Karst Peaks",
    location: "Halong Bay, Quang Ninh, Vietnam",
    category: "vietnam",
    categoryLabel: "Vietnam Tours",
    image: "/images/gallery/vietnam-halong-bay-cruise-karst.jpg",
    description: "Traditional cruise vessel sailing through emerald waters surrounded by ancient limestone karst pillars in UNESCO World Heritage Halong Bay.",
    date: "October 2026",
  },
  {
    id: 702,
    title: "Panoramic 360° Bay Vista from Titov Island",
    location: "Titov Island, Halong Bay, Vietnam",
    category: "vietnam",
    categoryLabel: "Vietnam Tours",
    image: "/images/gallery/vietnam-halong-bay-titov-island-view.jpg",
    description: "Breathtaking panoramic vista overlooking countless islands and turquoise waters from the summit observation deck on Titov Island.",
    date: "October 2026",
  },
  {
    id: 703,
    title: "Mystical Sung Sot (Surprise Cave) Chambers",
    location: "Bo Hon Island, Halong Bay, Vietnam",
    category: "vietnam",
    categoryLabel: "Vietnam Tours",
    image: "/images/gallery/vietnam-halong-bay-surprise-cave.jpg",
    description: "Magnificent illuminated stalactites, stalagmites, and cavern ceilings inside Surprise Cave, one of Halong Bay's greatest natural wonders.",
    date: "October 2026",
  },
  {
    id: 704,
    title: "Hoan Kiem Lake & Historic Turtle Tower",
    location: "Hoan Kiem District, Hanoi, Vietnam",
    category: "vietnam",
    categoryLabel: "Vietnam Tours",
    image: "/images/gallery/vietnam-hanoi-hoan-kiem-lake.jpg",
    description: "Serene morning reflections of the iconic Turtle Tower on Hoan Kiem Lake in the cultural center of Hanoi.",
    date: "October 2026",
  },
  {
    id: 705,
    title: "Temple of Literature (Van Mieu)",
    location: "Dong Da District, Hanoi, Vietnam",
    category: "vietnam",
    categoryLabel: "Vietnam Tours",
    image: "/images/gallery/vietnam-hanoi-temple-of-literature.jpg",
    description: "Vietnam's first historic national university founded in 1070, featuring peaceful courtyards, stone turtle steles, and ancient red-lacquered pavilion architecture.",
    date: "October 2026",
  },
  {
    id: 706,
    title: "Charming Hanoi Old Quarter Street Culture",
    location: "Old Quarter, Hanoi, Vietnam",
    category: "vietnam",
    categoryLabel: "Vietnam Tours",
    image: "/images/gallery/vietnam-hanoi-old-quarter-street.jpg",
    description: "Vibrant colonial streets lined with cozy cafes, egg coffee shops, silk stalls, and lively street life in Hanoi's historic 36 Guilds quarter.",
    date: "October 2026",
  },
  {
    id: 707,
    title: "Halong Bay Luxury Cruise Yacht at Sunset",
    location: "Halong Bay, Quang Ninh, Vietnam",
    category: "vietnam",
    categoryLabel: "Vietnam Tours",
    image: "/images/gallery/halong-bay-luxury-yacht-cruise-sunset.png",
    description: "Ultra-modern luxury multi-deck cruise yacht sailing serenely through Halong Bay's iconic limestone karst peaks at dusk.",
    date: "October 2026",
  },
  {
    id: 708,
    title: "Traditional Vietnamese Junk Boat 'Signature Halong'",
    location: "Halong Bay, Quang Ninh, Vietnam",
    category: "vietnam",
    categoryLabel: "Vietnam Tours",
    image: "/images/gallery/halong-bay-signature-cruise-sails.png",
    description: "Authentic Halong Bay cruise ship with billowing canvas sails and warm glowing cabin windows amidst misty karsts.",
    date: "October 2026",
  },
  {
    id: 709,
    title: "Golden Buddha Meditation Shrine",
    location: "Bangkok & Pattaya, Thailand",
    category: "thailand",
    categoryLabel: "Thailand Tours",
    image: "/images/gallery/bangkok-golden-buddha-temple-shrine.png",
    description: "Magnificent towering golden Buddha in peaceful meditative posture with ornate Buddhist stupa spires.",
    date: "October 2026",
  },
  {
    id: 710,
    title: "Tropical Turquoise Lagoon & Ocean Viewpoint",
    location: "Coral Island & Tropical Waters",
    category: "destinations",
    categoryLabel: "Destinations",
    image: "/images/gallery/coral-island-tropical-lagoon-view.png",
    description: "Spectacular sweeping overlook of white swirling sandbanks and crystal aqua-turquoise tropical lagoon waters from elevated wooden boardwalk.",
    date: "October 2026",
  },
  {
    id: 711,
    title: "International Jet Flight Ascent",
    location: "Kathmandu TIA / International Routes",
    category: "flights",
    categoryLabel: "Flight Experiences",
    image: "/images/gallery/international-air-flight-takeoff.png",
    description: "Smooth high-altitude climb on modern twin-engine jetliner connecting Kathmandu to Southeast Asia destinations.",
    date: "October 2026",
  },
  {
    id: 712,
    title: "Thailand, Malaysia & Singapore Tri-Country Wonders",
    location: "Bangkok, Kuala Lumpur & Singapore",
    category: "destinations",
    categoryLabel: "Destinations",
    image: "/images/gallery/thailand-malaysia-singapore-trio.jpg",
    description: "Spectacular collage featuring Bangkok's Wat Phra Kaew Yaksha guardian, Kuala Lumpur's Petronas Twin Towers with national flag, and Singapore's glowing Gardens by the Bay.",
    date: "October 2026",
  },
];

export default function GalleryClient() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [items, setItems] = useState(GALLERY_ITEMS);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("skywalk_gallery_photos");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Keep official photos always prioritized at top
            const officialUrls = new Set(GALLERY_ITEMS.map((g) => g.image));
            const userUploaded = parsed.filter((p: any) => !officialUrls.has(p.image));
            setItems([...GALLERY_ITEMS, ...userUploaded]);
            return;
          }
        } catch (e) {}
      }
    }
  }, []);

  const filteredItems =
    activeCategory === "all"
      ? items
      : activeCategory === "thailand"
      ? items.filter((item) => item.location.toLowerCase().includes("thailand") || item.location.toLowerCase().includes("bangkok") || item.location.toLowerCase().includes("pattaya") || item.location.toLowerCase().includes("phuket") || item.location.toLowerCase().includes("krabi") || item.category === "thailand")
      : activeCategory === "vietnam"
      ? items.filter((item) => item.location.toLowerCase().includes("vietnam") || item.location.toLowerCase().includes("hanoi") || item.location.toLowerCase().includes("halong") || item.location.toLowerCase().includes("da nang") || item.location.toLowerCase().includes("hoi an") || item.category === "vietnam")
      : activeCategory === "srilanka"
      ? items.filter((item) => item.location.toLowerCase().includes("sri lanka") || item.location.toLowerCase().includes("colombo") || item.location.toLowerCase().includes("sigiriya") || item.location.toLowerCase().includes("ella") || item.location.toLowerCase().includes("galle") || item.category === "srilanka")
      : activeCategory === "bali"
      ? items.filter((item) => item.location.toLowerCase().includes("bali") || item.location.toLowerCase().includes("ubud") || item.location.toLowerCase().includes("indonesia") || item.category === "bali")
      : activeCategory === "malaysia"
      ? items.filter((item) => item.location.toLowerCase().includes("malaysia") || item.location.toLowerCase().includes("kuala lumpur") || item.location.toLowerCase().includes("singapore") || item.location.toLowerCase().includes("genting") || item.category === "malaysia" || item.categoryLabel.toLowerCase().includes("singapore") || item.categoryLabel.toLowerCase().includes("malaysia"))
      : activeCategory === "maldives"
      ? items.filter((item) => item.location.toLowerCase().includes("maldives") || item.location.toLowerCase().includes("malé") || item.category === "maldives" || item.categoryLabel.toLowerCase().includes("maldives"))
      : activeCategory === "philippines"
      ? items.filter((item) => item.location.toLowerCase().includes("philippines") || item.location.toLowerCase().includes("manila") || item.location.toLowerCase().includes("palawan") || item.location.toLowerCase().includes("boracay") || item.location.toLowerCase().includes("el nido") || item.category === "philippines" || item.categoryLabel.toLowerCase().includes("philippines"))
      : activeCategory === "travelers"
      ? items.filter((item) => item.category === "travelers" || item.categoryLabel.toLowerCase().includes("traveler"))
      : activeCategory === "flights"
      ? items.filter((item) => item.category === "flights" || item.categoryLabel.toLowerCase().includes("flight"))
      : activeCategory === "resorts"
      ? items.filter((item) => item.category === "resorts" || item.categoryLabel.toLowerCase().includes("resort"))
      : items.filter((item) => item.category === activeCategory);

  const handleNextLightbox = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! + 1) % filteredItems.length);
  }, [lightboxIndex, filteredItems.length]);

  const handlePrevLightbox = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! - 1 + filteredItems.length) % filteredItems.length);
  }, [lightboxIndex, filteredItems.length]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "ArrowRight") handleNextLightbox();
      if (e.key === "ArrowLeft") handlePrevLightbox();
      if (e.key === "Escape") setLightboxIndex(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, handleNextLightbox, handlePrevLightbox]);

  const currentItem = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20">
      {/* Hero Banner Section (Full Width, Crisp Graphic Banner) */}
      <section className="relative w-full overflow-hidden bg-[#0a1628]">
        <div className="relative w-full h-[220px] sm:h-[300px] md:h-[380px] lg:h-[440px] xl:h-[480px]">
          {/* Background Travel Gallery Banner Image */}
          <Image
            src="/images/gallery-hero-banner.png"
            alt="Our Travel Photo Gallery — Skywalks Holidays"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
      </section>

      {/* Floating 4-Card Gallery Highlights Strip (Matching About & Contact pages) */}
      <section className="relative z-20 -mt-8 sm:-mt-10 md:-mt-12 pb-8 px-4">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {GALLERY_HIGHLIGHT_CARDS.map((item) => {
              const Icon = item.icon;
              const isSelected = activeCategory === item.categoryId;
              return (
                <button
                  key={item.title}
                  onClick={() => {
                    setActiveCategory(item.categoryId);
                    setLightboxIndex(null);
                  }}
                  className={`bg-white rounded-3xl p-5 sm:p-6 border shadow-xl text-center group hover:border-[#0ea5e9] hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex flex-col items-center justify-between cursor-pointer ${
                    isSelected ? "border-[#0ea5e9] ring-2 ring-[#0ea5e9]/20" : "border-[#e2e8f0]"
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-2xl ${item.color} flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon size={20} />
                  </div>
                  <div className="text-lg sm:text-xl md:text-2xl font-black text-[#0a1628] group-hover:text-[#0ea5e9] transition-colors mb-0.5 tracking-tight">
                    {item.title}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-[#334155] mb-1 truncate max-w-full">
                    {item.subtitle}
                  </div>
                  <div className="text-[11px] text-[#94a3b8] line-clamp-1">
                    {item.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Category Navigation Tabs */}
      <section className="container-custom relative z-20 mb-10">
        <div className="bg-white rounded-2xl p-2.5 shadow-xl border border-[#e2e8f0] flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setLightboxIndex(null);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-[#0a1628] text-white shadow-md"
                  : "text-[#64748b] hover:text-[#0a1628] hover:bg-[#f1f5f9]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Photo Gallery Grid */}
      <section className="container-custom">
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          <AnimatePresence>
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                onClick={() => setLightboxIndex(index)}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl border border-[#e2e8f0] cursor-pointer transition-all duration-300"
              >
                {/* Photo Image */}
                <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-200">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                  {/* Badge */}
                  <div className="absolute top-3 left-3 bg-[#0a1628]/80 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/20">
                    {item.categoryLabel}
                  </div>

                  {/* Expand icon on hover */}
                  <div className="absolute top-3 right-3 bg-white/20 group-hover:bg-[#0ea5e9] text-white p-2 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 transform group-hover:scale-110">
                    <Maximize2 size={16} />
                  </div>

                  {/* Caption info at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <div className="flex items-center gap-1.5 text-xs text-[#38bdf8] font-semibold mb-1">
                      <MapPin size={12} />
                      <span>{item.location}</span>
                    </div>
                    <h3 className="font-bold text-sm sm:text-base leading-snug line-clamp-2 drop-shadow">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Lightbox Full Screen Modal View */}
      <AnimatePresence>
        {lightboxIndex !== null && currentItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6"
          >
            {/* Top Modal Navigation Header */}
            <div className="flex items-center justify-between text-white z-10 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-xs bg-[#0ea5e9] font-bold px-3 py-1 rounded-full uppercase">
                  {currentItem.categoryLabel}
                </span>
                <span className="text-white/60 text-xs hidden sm:inline">
                  {lightboxIndex + 1} of {filteredItems.length}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-md transition-colors"
                >
                  {copied ? <Check size={14} className="text-green-400" /> : <Share2 size={14} />}
                  <span>{copied ? "Link Copied!" : "Share"}</span>
                </button>
                <button
                  onClick={() => setLightboxIndex(null)}
                  className="p-2 rounded-full bg-white/10 hover:bg-red-500 text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Main Lightbox Body with Controls */}
            <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
              {/* Prev Arrow */}
              <button
                onClick={handlePrevLightbox}
                className="absolute left-2 sm:left-4 z-20 p-3 rounded-full bg-white/10 hover:bg-[#0ea5e9] text-white border border-white/20 backdrop-blur-md transition-all cursor-pointer"
                aria-label="Previous photo"
              >
                <ChevronLeft size={24} />
              </button>

              {/* Image Container */}
              <div className="relative w-full max-w-5xl h-[55vh] sm:h-[65vh] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={currentItem.image}
                  alt={currentItem.title}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>

              {/* Next Arrow */}
              <button
                onClick={handleNextLightbox}
                className="absolute right-2 sm:right-4 z-20 p-3 rounded-full bg-white/10 hover:bg-[#0ea5e9] text-white border border-white/20 backdrop-blur-md transition-all cursor-pointer"
                aria-label="Next photo"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Bottom Info Bar */}
            <div className="max-w-4xl mx-auto w-full bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 sm:p-5 text-white flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#38bdf8] font-bold mb-1">
                  <MapPin size={14} />
                  <span>{currentItem.location}</span>
                  <span>•</span>
                  <span className="text-white/60">{currentItem.date}</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold">{currentItem.title}</h2>
                <p className="text-white/80 text-xs sm:text-sm mt-1">{currentItem.description}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
                <Button
                  size="default"
                  asChild
                  className="bg-[#f97316] hover:bg-[#ea580c] text-white font-bold w-full md:w-auto"
                >
                  <a
                    href={buildCustomWhatsAppLink(
                      `Hello Skywalk Holidays! I saw this photo of "${currentItem.title}" (${currentItem.location}) in your media gallery. Please send me package details & pricing!`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Phone size={16} />
                    Inquire via WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom CTA Banner */}
      <section className="container-custom mt-16">
        <div className="bg-gradient-to-r from-[#0a1628] via-[#0f2342] to-[#0ea5e9] rounded-3xl p-8 sm:p-12 text-white text-center relative overflow-hidden shadow-2xl">
          <Sparkles className="absolute top-4 left-4 text-amber-400 opacity-30" size={48} />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-extrabold mb-4">
              Want Your Photos Featured in Our Gallery?
            </h2>
            <p className="text-white/85 text-sm sm:text-base mb-8 leading-relaxed">
              Book your next international tour package with Skywalk Holidays and share your favorite travel moments with us!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild className="bg-[#f97316] hover:bg-[#ea580c] text-white font-bold w-full sm:w-auto">
                <Link href="/services/packages/international">
                  Explore Tour Packages
                  <ArrowRight size={18} />
                </Link>
              </Button>
              <Button size="lg" variant="outline-white" asChild className="w-full sm:w-auto border-white/30">
                <Link href="/contact">Contact Travel Expert</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
