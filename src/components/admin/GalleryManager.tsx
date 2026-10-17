"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Plus,
  Edit,
  Trash2,
  Camera,
  MapPin,
  Calendar,
  Tag,
  Upload,
  X,
  Save,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface GalleryRecord {
  id: number;
  title: string;
  location: string;
  category: "destinations" | "travelers" | "resorts" | "flights" | string;
  categoryLabel: string;
  image: string;
  description: string;
  date: string;
}

export const DEFAULT_GALLERY_PHOTOS: GalleryRecord[] = [
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
    categoryLabel: "Flight Experiences",
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
    categoryLabel: "Flight Experiences",
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
    categoryLabel: "Flight Experiences",
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
    categoryLabel: "Flight Experiences",
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
    category: "destinations",
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
];

export default function GalleryManager() {
  const [photos, setPhotos] = useState<GalleryRecord[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<Partial<GalleryRecord> | null>(null);
  const [uploading, setUploading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Load photos from localStorage or defaults
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("skywalk_gallery_photos");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const existingUrls = new Set(parsed.map((p: any) => p.image));
            const missingOfficial = DEFAULT_GALLERY_PHOTOS.filter((g) => !existingUrls.has(g.image));
            setPhotos([...missingOfficial, ...parsed]);
            return;
          }
        } catch (e) {}
      }
    }
    setPhotos(DEFAULT_GALLERY_PHOTOS);
  }, []);

  // Sync to localStorage
  const savePhotosState = (updatedPhotos: GalleryRecord[]) => {
    setPhotos(updatedPhotos);
    if (typeof window !== "undefined") {
      localStorage.setItem("skywalk_gallery_photos", JSON.stringify(updatedPhotos));
    }
  };

  const handleOpenCreate = () => {
    setEditingPhoto({
      title: "",
      location: "",
      category: "destinations",
      categoryLabel: "Destinations",
      image: "",
      description: "",
      date: "October 2026",
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (photo: GalleryRecord) => {
    setEditingPhoto({ ...photo });
    setIsEditing(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingPhoto) return;

    setUploading(true);
    try {
      const data = new FormData();
      data.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      if (res.ok) {
        const json = await res.json();
        if (json.url) {
          setEditingPhoto((prev) => (prev ? { ...prev, image: json.url } : null));
        }
      } else {
        alert("Image upload failed. Please try again.");
      }
    } catch (err) {
      alert("Error uploading file from local device.");
    } finally {
      setUploading(false);
    }
  };

  const handleSavePhoto = () => {
    if (!editingPhoto || !editingPhoto.title || !editingPhoto.image) {
      alert("Please fill in at least Title and Photo Image.");
      return;
    }

    const categoryMap: Record<string, string> = {
      destinations: "Destinations",
      travelers: "Happy Travelers",
      resorts: "Luxury Resorts",
      flights: "Flight Experiences",
    };

    const categoryLabel = categoryMap[editingPhoto.category || "destinations"] || "Destinations";

    if (editingPhoto.id) {
      // Edit existing
      const updated = photos.map((p) =>
        p.id === editingPhoto.id ? ({ ...editingPhoto, categoryLabel } as GalleryRecord) : p
      );
      savePhotosState(updated);
    } else {
      // Create new
      const newPhoto: GalleryRecord = {
        id: Date.now(),
        title: editingPhoto.title || "Untitled Photo",
        location: editingPhoto.location || "Nepal / Global",
        category: (editingPhoto.category as any) || "destinations",
        categoryLabel,
        image: editingPhoto.image || "",
        description: editingPhoto.description || "",
        date: editingPhoto.date || "October 2026",
      };
      savePhotosState([newPhoto, ...photos]);
    }

    setIsEditing(false);
    setEditingPhoto(null);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleDeletePhoto = (id: number) => {
    if (confirm("Are you sure you want to delete this gallery photo?")) {
      const updated = photos.filter((p) => p.id !== id);
      savePhotosState(updated);
    }
  };

  const handleResetDefaults = () => {
    if (confirm("Reset photo gallery to default showcase photos?")) {
      savePhotosState(DEFAULT_GALLERY_PHOTOS);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#e2e8f0] shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-[#0a1628] flex items-center gap-2">
            <Camera className="text-[#0ea5e9]" size={22} />
            Photo Gallery Inventory Manager
          </h2>
          <p className="text-xs text-[#64748b] mt-1">
            Manage photos displayed on the main Photo Gallery page (/gallery). Upload local photos or paste image URLs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleResetDefaults} className="gap-1.5 text-xs text-[#64748b]">
            <RefreshCw size={14} /> Reset Defaults
          </Button>
          <Button onClick={handleOpenCreate} className="bg-[#f97316] hover:bg-[#ea580c] text-white font-bold text-xs gap-1.5 rounded-xl">
            <Plus size={16} /> Add New Gallery Photo
          </Button>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center gap-2 text-xs font-bold">
          <CheckCircle2 size={16} className="text-emerald-600" />
          Photo Gallery updated successfully! Changes are live on /gallery.
        </div>
      )}

      {/* Add / Edit Form Modal Box */}
      {isEditing && editingPhoto && (
        <div className="bg-white p-6 rounded-3xl border-2 border-[#0ea5e9] shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-4">
            <h3 className="text-base font-bold text-[#0a1628]">
              {editingPhoto.id ? "Edit Gallery Photo" : "Add New Photo to Gallery"}
            </h3>
            <button onClick={() => setIsEditing(false)} className="text-[#94a3b8] hover:text-[#0a1628]">
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1 block">
                Photo Title *
              </label>
              <Input
                placeholder="e.g. Chao Phraya Luxury Dinner Cruise"
                value={editingPhoto.title || ""}
                onChange={(e) => setEditingPhoto({ ...editingPhoto, title: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1 block">
                Location / Destination *
              </label>
              <Input
                placeholder="e.g. Bangkok, Thailand or Seminyak, Bali"
                value={editingPhoto.location || ""}
                onChange={(e) => setEditingPhoto({ ...editingPhoto, location: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1 block">
                Category *
              </label>
              <select
                className="w-full h-10 rounded-xl border border-[#e2e8f0] bg-white px-3 text-xs text-[#0a1628] focus:outline-none focus:border-[#0ea5e9]"
                value={editingPhoto.category || "destinations"}
                onChange={(e) => setEditingPhoto({ ...editingPhoto, category: e.target.value as any })}
              >
                <option value="destinations">Destinations</option>
                <option value="travelers">Happy Travelers</option>
                <option value="resorts">Luxury Resorts</option>
                <option value="flights">Flight Experiences</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1 block">
                Travel Date / Tag
              </label>
              <Input
                placeholder="e.g. October 2026"
                value={editingPhoto.date || ""}
                onChange={(e) => setEditingPhoto({ ...editingPhoto, date: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Photo Image *</span>
                <span className="text-[11px] font-medium text-[#0ea5e9]">Paste URL or Upload Local File</span>
              </label>
              <div className="flex gap-2 items-center">
                <Input
                  placeholder="https://images.unsplash.com/... or /uploads/..."
                  value={editingPhoto.image || ""}
                  onChange={(e) => setEditingPhoto({ ...editingPhoto, image: e.target.value })}
                  className="flex-1"
                />
                <label className="cursor-pointer inline-flex items-center gap-1.5 bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 shadow-sm">
                  <Upload size={14} />
                  {uploading ? "Uploading..." : "Upload from Device"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                </label>
              </div>

              {/* Thumbnail Preview */}
              {editingPhoto.image && (
                <div className="mt-3 flex items-center gap-3 bg-[#f8fafc] p-2 rounded-xl border border-[#e2e8f0]">
                  <div className="relative w-28 h-20 rounded-lg overflow-hidden border border-[#e2e8f0] bg-slate-900 shrink-0">
                    <Image src={editingPhoto.image} alt="Preview" fill className="object-cover" />
                  </div>
                  <div className="text-[11px] text-[#64748b] truncate">
                    <span className="font-semibold text-[#0a1628] block">Photo Image Preview</span>
                    <span className="truncate block font-mono text-[10px]">{editingPhoto.image}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1 block">
                Caption / Description
              </label>
              <textarea
                rows={3}
                className="w-full rounded-xl border border-[#e2e8f0] bg-white p-3 text-xs text-[#0a1628] focus:outline-none focus:border-[#0ea5e9]"
                placeholder="Short description or travel story for this photo..."
                value={editingPhoto.description || ""}
                onChange={(e) => setEditingPhoto({ ...editingPhoto, description: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[#e2e8f0]">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePhoto} className="bg-[#f97316] hover:bg-[#ea580c] text-white font-bold gap-2">
              <Save size={16} />
              Save Photo to Gallery
            </Button>
          </div>
        </div>
      )}

      {/* Gallery Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="bg-white rounded-3xl border border-[#e2e8f0] overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Photo Image Box */}
              <div className="relative aspect-[4/3] w-full bg-slate-900 overflow-hidden">
                <Image
                  src={photo.image}
                  alt={photo.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 300px"
                />
                <span className="absolute top-3 left-3 bg-[#0a1628]/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                  {photo.categoryLabel}
                </span>
                <span className="absolute bottom-3 right-3 bg-white/90 text-[#0a1628] text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow">
                  {photo.date}
                </span>
              </div>

              {/* Details */}
              <div className="p-5">
                <div className="flex items-center gap-1 text-[11px] font-semibold text-[#0ea5e9] mb-1">
                  <MapPin size={12} />
                  {photo.location}
                </div>
                <h4 className="font-bold text-[#0a1628] text-sm leading-snug mb-2 line-clamp-2">
                  {photo.title}
                </h4>
                <p className="text-[#64748b] text-xs line-clamp-2 leading-relaxed">
                  {photo.description}
                </p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="p-4 bg-[#f8fafc] border-t border-[#e2e8f0] flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#94a3b8]">ID: #{photo.id}</span>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => handleOpenEdit(photo)} className="gap-1 text-xs">
                  <Edit size={12} /> Edit
                </Button>
                <Button size="sm" onClick={() => handleDeletePhoto(photo.id)} className="gap-1 text-xs bg-red-600 hover:bg-red-700 text-white font-bold">
                  <Trash2 size={12} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
