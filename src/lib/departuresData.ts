import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import { PACKAGES_DICTIONARY } from "@/lib/packagesData";

export interface DepartureItem {
  id: string;
  slug?: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  seasonTag: string;
  totalSeats: number;
  availableSeats: number;
  price: number;
  originalPrice: number;
  image: string;
  status: string;
  packageSlug?: string;
  duration?: string;
  overview?: string;
  highlights?: string[];
  itinerary?: { day: string; title: string; desc: string }[];
  inclusions?: string[];
  exclusions?: string[];
  gallery?: { url: string; caption: string }[];
}

export const SAMPLE_DEPARTURES: DepartureItem[] = [
  {
    id: "dep-001",
    title: "Vietnam & Ha Long Bay Cruise — Dashain Special",
    destination: "Hanoi, Ha Long Bay & Da Nang",
    startDate: "2026-10-12",
    endDate: "2026-10-18",
    seasonTag: "🪔 Dashain Special",
    totalSeats: 20,
    availableSeats: 3,
    price: 62000,
    originalPrice: 75000,
    image: "/images/gallery/vietnam-danang-golden-bridge-hands.jpg",
    status: "FILLING_FAST",
    packageSlug: "/packages/vietnam-6d",
    duration: "7 Days / 6 Nights",
    overview:
      "Celebrate Dashain amidst the legendary limestone pillars of Ha Long Bay and the mystical mountaintops of Ba Na Hills. This guaranteed group departure from Kathmandu includes international & domestic flights, a 5-star overnight luxury cruise on Ha Long Bay, 4-star city hotels, English-speaking local guides, and full Nepal visa support.",
    highlights: [
      "Guaranteed group flights from Kathmandu (KTM ⇄ HAN) with 25kg checked baggage",
      "5-Star Ha Long Bay luxury overnight cruise with private balcony cabin & seafood meals",
      "World-famous Golden Bridge held by giant stone hands atop Sun World Ba Na Hills",
      "Lantern-lit evening walking tour in UNESCO heritage Hoi An Ancient Town",
      "Bamboo basket spinning boat experience in Cam Thanh coconut water forest",
      "Guided walking tour of Hanoi Old Quarter, Hoan Kiem Lake & French Colonial quarters",
      "Domestic flight within Vietnam (Hanoi to Da Nang) included",
      "Full Vietnam tourist visa approval letter & document verification assistance",
    ],
    gallery: [
      {
        url: "/images/gallery/vietnam-danang-golden-bridge-hands.jpg",
        caption: "Golden Bridge held by Giant Stone Hands atop Ba Na Hills, Da Nang",
      },
      {
        url: "/images/gallery/halong-bay-signature-cruise-sails.png",
        caption: "5-Star Luxury Cruise sailing past Ha Long Bay Limestone Karsts",
      },
      {
        url: "/images/gallery/vietnam-halong-bay-surprise-cave.jpg",
        caption: "Exploring Sung Sot (Surprise) Cave Stalactites in Ha Long Bay",
      },
      {
        url: "/images/gallery/vietnam-halong-bay-titov-island-view.jpg",
        caption: "Panoramic 360° View of Ha Long Bay from Titov Island Summit",
      },
      {
        url: "/images/gallery/vietnam-hoi-an-lantern-night-river.jpg",
        caption: "Traditional Silk Lanterns illuminating Hoi An Ancient Town at Night",
      },
      {
        url: "/images/gallery/vietnam-hanoi-hoan-kiem-lake.jpg",
        caption: "Historic Hoan Kiem Lake & French Colonial Quarters in Central Hanoi",
      },
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Departure from Kathmandu to Hanoi & Old Quarter Walking Tour",
        desc: "Assemble at Tribhuvan International Airport for your international flight to Hanoi. Warm meet & greet by our Skywalk Holidays representative at Noi Bai Airport. Private AC coach transfer to our 4-star central Hanoi hotel. In the evening, enjoy a guided walking tour around legendary Hoan Kiem Lake, Ngoc Son Temple, and the vibrant night markets of Hanoi Old Quarter.",
      },
      {
        day: "Day 2",
        title: "Hanoi to Ha Long Bay — Board 5-Star Luxury Overnight Cruise",
        desc: "After breakfast, take the expressway to Ha Long Bay marina. Board your luxury 5-star cruise liner, greeted with welcome drinks. Savor a gourmet lunch as the ship glides past towering limestone islets like Fighting Cocks and Dinh Huong. Kayak through hidden lagoons, explore Sung Sot (Surprise) Cave, and watch the crimson sunset over the Gulf of Tonkin. Enjoy a Vietnamese cooking class and overnight onboard.",
      },
      {
        day: "Day 3",
        title: "Morning Tai Chi on Deck, Disembark & Flight to Coastal Da Nang",
        desc: "Awaken to a peaceful morning Tai Chi session on the sundeck followed by buffet breakfast. Visit Titov Island for a panoramic 360-degree viewpoint of Ha Long Bay or swim in the emerald waters. Cruise back to harbor at noon, disembark, and transfer to Hanoi Airport for your domestic flight to Da Nang. Check into our premium beachfront hotel and relax.",
      },
      {
        day: "Day 4",
        title: "Sun World Ba Na Hills & The Legendary Golden Bridge",
        desc: "Take the world-record modern cable car to Sun World Ba Na Hills. Walk across the internationally acclaimed Golden Bridge, cradled by massive stone hands hovering above the clouds. Tour the French Village, Linh Ung Pagoda with its giant Lady Buddha, and Fantasy Park before descending in the late afternoon.",
      },
      {
        day: "Day 5",
        title: "Cam Thanh Coconut Forest Basket Boat & Hoi An Lantern City",
        desc: "Experience the thrilling spinning round bamboo basket boat ride through the Cam Thanh water coconut waterways with local fishermen. In the afternoon, head to UNESCO World Heritage Hoi An Ancient Town. Wander through preserved merchant houses, the Japanese Covered Bridge, and marvel at thousands of floating colorful lanterns along the Thu Bon River.",
      },
      {
        day: "Day 6",
        title: "Marble Mountains, Beach Relaxation & Flight back to Hanoi",
        desc: "Explore the sacred limestone grottoes, pagodas, and panoramic peaks of Marble Mountains. Spend the afternoon strolling along the powdery white sands of My Khe Beach. Evening domestic flight returns you to Hanoi for souvenir shopping at Dong Xuan wholesale market.",
      },
      {
        day: "Day 7",
        title: "Hanoi Cultural Sightseeing & Return Flight to Kathmandu",
        desc: "Visit the historic Ho Chi Minh Mausoleum complex, One Pillar Pagoda, and Tran Quoc Pagoda on West Lake. Final group lunch and private transfer to Hanoi International Airport for your flight back to Kathmandu with cherished festival memories.",
      },
    ],
    inclusions: [
      "Round-trip international flight tickets (Kathmandu ⇄ Hanoi) with checked baggage",
      "Domestic flight within Vietnam (Hanoi ⇄ Da Nang)",
      "1 Night accommodation in 5-Star Luxury Ha Long Bay Cruise (Private Balcony Cabin)",
      "5 Nights accommodation in handpicked 4-Star hotels in Hanoi and Da Nang",
      "Daily buffet breakfast, lunches and dinners as per detailed itinerary",
      "Sun World Ba Na Hills all-inclusive cable car and Golden Bridge admission pass",
      "Cam Thanh coconut basket boat tour pass & Hoi An heritage town entry tickets",
      "Complete Vietnam Tourist Visa approval letter & file submission assistance",
      "Dedicated professional English-speaking tour guide & AC private coach transfers",
      "24/7 dedicated Nepali & Vietnamese tour manager assistance",
    ],
    exclusions: [
      "Vietnam visa stamping fee ($25 USD) payable upon arrival at airport",
      "Personal expenses such as laundry, alcoholic beverages, and minibar",
      "Optional water activities not mentioned in inclusions",
      "International travel medical insurance (available through Skywalk Holidays)",
    ],
  },
  {
    id: "dep-002",
    title: "Tropical Bali & Ubud Villa Escape",
    destination: "Bali, Indonesia",
    startDate: "2026-10-25",
    endDate: "2026-11-01",
    seasonTag: "🌺 Autumn Romance",
    totalSeats: 16,
    availableSeats: 5,
    price: 52000,
    originalPrice: 64000,
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    status: "UPCOMING",
    packageSlug: "/packages/bali-malaysia-7d",
    duration: "8 Days / 7 Nights",
    overview:
      "Escape to the Island of the Gods for an unforgettable autumn journey. Immerse yourself in the turquoise lagoons of Nusa Penida, the clifftop temples of Uluwatu, dramatic Kecak fire dance sunsets, and private pool luxury villas surrounded by Ubud's emerald jungles.",
    highlights: [
      "Round-trip international flights from Kathmandu to Denpasar, Bali",
      "Full-Day West Nusa Penida Island Speedboat tour: Kelingking T-Rex Beach & Angel's Billabong",
      "Uluwatu Clifftop Temple sunset & hypnotic Kecak Fire Dance performance",
      "Tanjung Benoa thrilling water sports (Banana boat & parasailing included)",
      "Tegallalang terraced rice paddies & the famous Bali Jungle Swing",
      "2 Nights in a private pool luxury villa in Ubud with floating breakfast option",
      "Romantic sunset candlelight seafood dinner right on Jimbaran Beach",
      "Indonesian Visa on Arrival assistance & electronic customs declaration pass",
    ],
    gallery: [
      {
        url: "/images/gallery/bali-kelingking-beach.jpg",
        caption: "Famous Clifftop Kelingking T-Rex Beach in Nusa Penida",
      },
      {
        url: "/images/gallery/bali-ulun-danu-beratan-water-temple.jpg",
        caption: "Ulun Danu Beratan Water Temple floating on Lake Beratan, Bedugul",
      },
      {
        url: "/images/gallery/bali-tegalalang-rice-terrace-swing.jpg",
        caption: "Thrilling Aloha Bali Jungle Swing over Tegallalang Palm Valleys",
      },
      {
        url: "/images/gallery/bali-mount-batur-kintamani.png",
        caption: "Panoramic View of Mount Batur Volcano & Caldera Lake in Kintamani",
      },
      {
        url: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1200&q=85",
        caption: "Spectacular Clifftop Temple of Uluwatu overlooking the Indian Ocean",
      },
      {
        url: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1200&q=85",
        caption: "Emerald Green Terraced Rice Fields in Tegallalang, Ubud",
      },
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Arrival in Denpasar (Bali) & Transfer to Kuta Beach Resort",
        desc: "Arrive at Ngurah Rai International Airport. Greeted with traditional Balinese floral garlands by our Skywalk Holidays team. Private transfer to our beachfront 4-star resort in Kuta / Seminyak. Check-in, relax by the tropical pool, and enjoy your first Balinese sunset.",
      },
      {
        day: "Day 2",
        title: "Tanjung Benoa Water Sports & Uluwatu Clifftop Sunset Kecak Dance",
        desc: "Head south to Tanjung Benoa peninsula for thrilling ocean activities including banana boat ride and jet ski. In the afternoon, visit the dramatic 70-meter sea cliffs of Uluwatu Temple, perched over crashing ocean waves. Watch the hypnotic Kecak & Fire Dance show as the sun sinks into the Indian Ocean.",
      },
      {
        day: "Day 3",
        title: "Nusa Penida Island Speedboat Expedition: Kelingking & Broken Beach",
        desc: "Early morning fast boat cruise to rugged Nusa Penida Island. Witness the world-renowned Kelingking T-Rex cliff, swim at Crystal Bay, marvel at Broken Beach, and stand above the natural infinity pool at Angel's Billabong. Savor an Indonesian lunch on the island before returning by afternoon speedboat.",
      },
      {
        day: "Day 4",
        title: "Transfer to Ubud — Tegenungan Waterfall & Ubud Royal Palace",
        desc: "Journey into the cultural heartland of Bali. Stop at majestic Tegenungan Waterfall for photos and refreshing mountain breeze. Arrive in Ubud and check into our luxury private pool villa. Visit Ubud Royal Palace (Puri Saren Agung) and wander through the vibrant Ubud Art Market.",
      },
      {
        day: "Day 5",
        title: "Tegallalang Terraces, Thrilling Jungle Swing & Luwak Coffee Plantation",
        desc: "Walk amidst the sculpted green tiers of Tegallalang Rice Terraces. Experience the world-famous Aloha Bali Jungle Swing soaring high above tropical palm valleys. Later, tour an authentic Luwak coffee farm, roasting beans and sampling Balinese herbal infusions.",
      },
      {
        day: "Day 6",
        title: "Kintamani Volcano Panorama & Floating Ulun Danu Temple",
        desc: "Ascend to Kintamani highland for breathtaking vistas of active Mount Batur volcano and its shimmering crater lake. Enjoy buffet lunch overlooking the caldera. Continue north to Bedugul to visit the iconic Ulun Danu Beratan Temple, seemingly floating atop tranquil mountain waters.",
      },
      {
        day: "Day 7",
        title: "Balinese Herbal Spa Rejuvenation & Jimbaran Bay Candlelight Dinner",
        desc: "Treat yourself to a therapeutic 60-minute Balinese full-body aromatherapy massage. Spend the afternoon at leisure. At sunset, gather on the sandy shores of Jimbaran Bay for a romantic candlelight seafood dinner with acoustic Balinese musicians.",
      },
      {
        day: "Day 8",
        title: "Krisna Souvenir Shopping & Departure Flight to Kathmandu",
        desc: "Enjoy a leisurely villa breakfast. Pick up handcrafted wood carvings, silver jewelry, and Balinese spices at Krisna Oleh Oleh. Private airport transfer for your departure flight back home to Nepal.",
      },
    ],
    inclusions: [
      "Round-trip international flights (Kathmandu ⇄ Bali) with 25kg checked luggage",
      "5 Nights in 4-Star beachfront resort in Kuta/Seminyak",
      "2 Nights in a Luxury Private Pool Villa in Ubud",
      "Full-Day Nusa Penida speedboat tour with lunch & private island transport",
      "Tanjung Benoa water sports pass & Uluwatu Kecak Dance admission",
      "Famous Bali Jungle Swing entry & Luwak coffee plantation tasting",
      "Daily buffet breakfast & Jimbaran Bay sunset beachfront seafood dinner",
      "Indonesia Visa on Arrival guidance & electronic declaration assistance",
      "Dedicated air-conditioned private vehicle and English-speaking chauffeur throughout",
    ],
    exclusions: [
      "Indonesia Visa on Arrival fee (IDR 500,000 / approx. $35 USD) payable at airport",
      "Optional adventure sports (Scuba diving, ATV quad biking)",
      "Personal expenses, telephone, and minibar charges",
      "International travel insurance",
    ],
  },
  {
    id: "dep-003",
    title: "Thailand Phuket & Bangkok Beach Tour",
    destination: "Thailand",
    startDate: "2026-11-04",
    endDate: "2026-11-09",
    seasonTag: "🪔 Tihar Holiday",
    totalSeats: 24,
    availableSeats: 8,
    price: 38000,
    originalPrice: 46000,
    image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80",
    status: "UPCOMING",
    packageSlug: "/packages/phuket-bangkok-6d",
    duration: "6 Days / 5 Nights",
    overview:
      "Spend your Tihar holidays in tropical paradise! This fixed departure package offers guaranteed flights from Kathmandu, combining the turquoise beaches and limestone islands of Phuket with the dazzling shopping, temples, and Chaophraya luxury dinner cruises of Bangkok.",
    highlights: [
      "Roundtrip international & domestic Thailand flight tickets included",
      "Full-Day Speedboat Tour to Phi Phi Islands, Maya Bay & Khai Island with buffet lunch",
      "Phuket Big Buddha atop Nakkerd Hill & scenic Promthep Cape viewpoint",
      "Chaophraya Princess Luxury Evening Dinner Cruise with live band in Bangkok",
      "Guided Bangkok City Tour: 5.5-ton Solid Gold Buddha (Wat Traimit) & Wat Pho",
      "Full afternoon of tax-free shopping at Platinum Fashion Mall & Pratunam wholesale market",
      "4-Star hotel stays in central Patong Phuket and downtown Bangkok",
      "Complete Thailand Tourist e-Visa assistance from our Kathmandu office",
    ],
    gallery: [
      {
        url: "/images/gallery/phuket-phi-phi-maya-bay-boats.png",
        caption: "Maya Bay Turquoise Waters & Speedboats in Phi Phi Leh",
      },
      {
        url: "/images/gallery/phuket-phi-phi-lagoon-cliffs.png",
        caption: "Pileh Lagoon Crystal Emerald Waters and Limestone Karsts",
      },
      {
        url: "/images/gallery/thailand-phuket-big-buddha-marble.jpg",
        caption: "Phuket White Marble Big Buddha & Chalong Bay Viewpoint",
      },
      {
        url: "/images/gallery/bangkok-grand-palace.png",
        caption: "Bangkok Royal Grand Palace & Wat Phra Kaew Temple",
      },
      {
        url: "/images/gallery/bangkok-golden-buddha-temple-shrine.png",
        caption: "Wat Traimitr 5.5-Ton Solid Gold Buddha Temple Shrine",
      },
      {
        url: "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=1200&q=85",
        caption: "Chaophraya Princess River Cruise passing Illuminated Temples by Night",
      },
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Kathmandu to Phuket Flight Arrival & Patong Beach Check-In",
        desc: "Fly from Kathmandu to Phuket International Airport. Warm welcome by our airport guide and private transfer to our 4-star resort in vibrant Patong. Spend your afternoon unwinding on Patong Beach or exploring Bangla Road's electric nightlife and evening seafood street markets.",
      },
      {
        day: "Day 2",
        title: "Phi Phi Islands & Maya Bay Luxury Speedboat Excursion",
        desc: "Embark on an exhilarating speedboat ride across the Andaman Sea to the Phi Phi archipelago. Swim in the emerald waters of Maya Bay (featured in 'The Beach'), snorkel among colorful coral reefs at Pileh Lagoon, view Viking Cave, and enjoy a delicious beachside buffet lunch on Phi Phi Don. Return to Phuket by late afternoon.",
      },
      {
        day: "Day 3",
        title: "Phuket Cultural Landmarks, Big Buddha & Promthep Cape Sunset",
        desc: "Take a scenic guided drive across Phuket. Visit the revered 45-meter Big Buddha statue perched atop Nakkerd Hill with panoramic 360-degree views of Chalong Bay. Explore Wat Chalong temple, tour a cashew nut factory, and cap the day witnessing the famous Promthep Cape sunset.",
      },
      {
        day: "Day 4",
        title: "Flight to Bangkok & Chaophraya Princess Luxury Dinner Cruise",
        desc: "Morning flight from Phuket to Bangkok. Private transfer to our central 4-star Bangkok hotel. In the evening, board the grand Chaophraya Princess cruise ship. Savor an international buffet dinner accompanied by live saxophone music while drifting past illuminated landmarks including Wat Arun and the Grand Palace.",
      },
      {
        day: "Day 5",
        title: "Bangkok Golden Buddha Temples & Platinum Shopping Spree",
        desc: "Discover Bangkok's richest spiritual landmarks with a guided visit to Wat Traimit (housing the 5.5-ton solid gold Buddha) and Wat Pho (the Reclining Buddha). Spend the afternoon shopping for clothing, electronics, and souvenirs at Platinum Fashion Mall and Pratunam wholesale market.",
      },
      {
        day: "Day 6",
        title: "Hotel Breakfast, Last-Minute Shopping & Kathmandu Departure",
        desc: "Enjoy breakfast at the hotel. Free morning for last-minute shopping at MBK or Siam Paragon. Private transfer to Suvarnabhumi Airport for your return flight to Kathmandu.",
      },
    ],
    inclusions: [
      "Round-trip international flight tickets (Kathmandu ⇄ Phuket / Bangkok ⇄ Kathmandu)",
      "Domestic flight within Thailand (Phuket to Bangkok)",
      "3 Nights in 4-Star hotel in Patong Phuket with daily breakfast",
      "2 Nights in 4-Star hotel in central Bangkok with daily breakfast",
      "Full-Day Phi Phi Islands tour with speedboat, snorkeling equipment & buffet lunch",
      "Phi Phi National Park environmental entry fees included",
      "Chaophraya River luxury dinner cruise ticket with live entertainment",
      "Phuket and Bangkok guided sightseeing tours in private AC transport",
      "Complete Thailand Tourist e-Visa application review and issuance support",
    ],
    exclusions: [
      "Thailand visa fee (if applicable at time of travel)",
      "Personal expenses such as beverages, laundry, and room service",
      "Driver and local guide tips",
      "Travel insurance",
    ],
  },
  {
    id: "dep-004",
    title: "Grand Europe 4-Country Gala Departure",
    destination: "Paris, Swiss Alps, Venice & Rome",
    startDate: "2026-12-24",
    endDate: "2027-01-04",
    seasonTag: "🎆 New Year 2027",
    totalSeats: 15,
    availableSeats: 2,
    price: 195000,
    originalPrice: 230000,
    image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=80",
    status: "FILLING_FAST",
    packageSlug: "/services/custom",
    duration: "12 Days / 11 Nights",
    overview:
      "Ring in New Year 2027 across the most iconic capitals of Europe. From the sparkling winter lights of Paris and the snowy peaks of Mount Titlis to the romantic waterways of Venice and the ancient majesty of Rome & the Vatican, this guaranteed departure offers a truly royal holiday experience.",
    highlights: [
      "Roundtrip international flights from Kathmandu with premium airline connections",
      "Paris City Panorama: Eiffel Tower 2nd Level admission & illuminated Seine River cruise",
      "High-speed TGV train crossing French vineyards into picturesque Switzerland",
      "Mount Titlis revolving Rotair cable car, glacier snow park & Europe's highest suspension bridge",
      "Rhine Falls waterfall, Lake Zurich promenade, and fairytale Lucerne Chapel Bridge",
      "Private Venetian Gondola ride gliding through quiet waterways to the Grand Canal",
      "Florence Renaissance walking tour: Duomo, Ponte Vecchio & Piazzale Michelangelo",
      "Rome Colosseum, Roman Forum, Trevi Fountain & Vatican St. Peter's Basilica",
      "Grand New Year 2027 Gala Dinner celebration with music and festive countdown in Rome",
      "Full Schengen Visa documentation, file assembly, cover letter & VFS appointment assistance",
    ],
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=85",
        caption: "Eiffel Tower glittering against the Parisian winter sky",
      },
      {
        url: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=1200&q=85",
        caption: "Mount Titlis snowy alpine peaks in Central Switzerland",
      },
      {
        url: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=1200&q=85",
        caption: "Romantic Gondolas on the Grand Canal, Venice",
      },
      {
        url: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&q=85",
        caption: "Historic Colosseum under golden sunset in Rome",
      },
      {
        url: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?w=1200&q=85",
        caption: "Historic Wooden Chapel Bridge & Lake Lucerne Waterfront",
      },
      {
        url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&q=85",
        caption: "St. Peter's Basilica & Vatican City Imperial Square",
      },
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Departure from Kathmandu to Paris (Charles de Gaulle)",
        desc: "Assemble at Tribhuvan International Airport for your international flight to Paris. On arrival at CDG Airport, meet our European tour manager and transfer by private coach to our 4-star Paris hotel. Enjoy dinner and tour briefing.",
      },
      {
        day: "Day 2",
        title: "Paris City Panorama, Eiffel Tower 2nd Level & Seine River Cruise",
        desc: "Embark on a guided sightseeing tour past the Arc de Triomphe, Champs-Élysées, Place de la Concorde, and Notre Dame. Ascend to the 2nd level of the Eiffel Tower for a breathtaking view of Paris. Later, enjoy a relaxing 1-hour cruise along the River Seine admiring illuminated bridges and landmarks.",
      },
      {
        day: "Day 3",
        title: "High-Speed TGV Train to Lucerne & Lake Lucerne Evening Walk",
        desc: "Board the high-speed TGV train across the rolling French countryside into fairytale Switzerland. Arrive in Lucerne. Stroll across the 14th-century covered wooden Chapel Bridge, see the touching Lion Monument, and wander the historic cobblestone squares along the lake.",
      },
      {
        day: "Day 4",
        title: "Mount Titlis Rotair Revolving Cable Car & Eternal Glacier Snow",
        desc: "Ascend to Mount Titlis at 3,020 meters aboard the world's first revolving Titlis Rotair gondola. Experience eternal snow, walk through the mystical 150-meter Glacier Cave, brave the Titlis Cliff Walk (Europe's highest suspension bridge), and enjoy snow activities.",
      },
      {
        day: "Day 5",
        title: "Zurich Highlights, Lake Promenade & Powerful Rhine Falls",
        desc: "Explore Zurich, Switzerland's financial capital. Walk along Bahnhofstrasse and the scenic Limmat River. Travel north to Schaffhausen to marvel at Rhine Falls, mainland Europe's largest and most powerful waterfall.",
      },
      {
        day: "Day 6",
        title: "Alpine Scenic Crossing through Gotthard into Venice (Italy)",
        desc: "Journey south through the majestic Swiss Alps across the Gotthard pass into Italy. Arrive in the romantic Veneto region and check into our hotel. Enjoy an authentic Italian pasta dinner.",
      },
      {
        day: "Day 7",
        title: "Venice Lagoon, St. Mark's Square & Private Gondola Ride",
        desc: "Take a private water taxi across the lagoon into St. Mark's Square. Walking tour past the Doge's Palace exterior, Bridge of Sighs, and a live Murano glassblowing demonstration. Experience the quintessential Venice moment: gliding through serene canals on a private Gondola.",
      },
      {
        day: "Day 8",
        title: "Florence Renaissance Cradle (Duomo & Ponte Vecchio) to Rome",
        desc: "Drive to Florence, the birthplace of the Renaissance. Marvel at the Santa Maria del Fiore Duomo, Giotto's Bell Tower, and the historic jewelry shops of Ponte Vecchio. Continue your journey southward to the Eternal City of Rome.",
      },
      {
        day: "Day 9",
        title: "Imperial Rome: Colosseum, Roman Forum, Trevi Fountain & Spanish Steps",
        desc: "Step back into ancient history with guided sightseeing around the Colosseum, Roman Forum, and Circus Maximus. Walk to the world-famous Trevi Fountain to toss a coin ensuring your return to Rome, and browse the lively Spanish Steps.",
      },
      {
        day: "Day 10",
        title: "Vatican City: St. Peter's Basilica & Michelangelo's Masterpieces",
        desc: "Visit the sovereign state of Vatican City. Guided exploration inside the monumental St. Peter's Basilica, viewing Michelangelo's Pieta and Bernini's high altar canopy. Free afternoon for boutique shopping along Via del Corso.",
      },
      {
        day: "Day 11",
        title: "Rome at Leisure & Grand New Year 2027 Gala Celebration",
        desc: "Enjoy a free day in Rome at your own pace. In the evening, dress in your finest festive attire for our Skywalk Holidays Grand New Year Gala Dinner featuring an exquisite multi-course Italian banquet, champagne toasts, and countdown celebrations.",
      },
      {
        day: "Day 12",
        title: "Farewell Breakfast & Return Flight to Kathmandu",
        desc: "Enjoy breakfast at the hotel. Transfer to Rome Fiumicino Airport for your departure flight back home to Kathmandu, concluding your unforgettable European holiday.",
      },
    ],
    inclusions: [
      "Round-trip international flights (Kathmandu ⇄ Paris / Rome ⇄ Kathmandu) with full baggage",
      "11 Nights accommodation in handpicked 4-Star premium European hotels",
      "Daily buffet breakfast & specialty Continental / Indian dinners",
      "High-speed TGV / Eurail train tickets crossing European borders",
      "Eiffel Tower 2nd stage admission ticket & 1-hour Seine River cruise",
      "Mount Titlis revolving Rotair cable car & Glacier Cave pass",
      "Private Venice water taxis & authentic Gondola ride on the Grand Canal",
      "Grand New Year 2027 Gala Dinner celebration with festive countdown in Rome",
      "Comprehensive Schengen Visa file preparation, cover letter & VFS appointment guidance",
      "Professional English-speaking European tour manager throughout the entire trip",
    ],
    exclusions: [
      "Schengen Visa fee and VFS processing charge",
      "City tourist taxes (approx. €3 to €6 per person per night payable directly to hotel reception)",
      "Optional excursions not listed in inclusions",
      "Mandatory Schengen travel medical insurance",
    ],
  },
];

const DATA_DIR = path.join(process.cwd(), "src", "data");
const DEPARTURES_FILE = path.join(DATA_DIR, "departures.json");

export function getStoredDepartures(): DepartureItem[] {
  try {
    if (fs.existsSync(DEPARTURES_FILE)) {
      const raw = fs.readFileSync(DEPARTURES_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
    // Initialize file if not found
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DEPARTURES_FILE, JSON.stringify([], null, 2), "utf-8");
    return [];
  } catch (err) {
    console.error("Error reading departures file:", err);
    return [];
  }
}

export function saveStoredDeparture(dep: Partial<DepartureItem> & { id?: string }): DepartureItem {
  const current = getStoredDepartures();
  let updatedDep: DepartureItem;

  if (dep.id) {
    const index = current.findIndex((d) => d.id === dep.id);
    const existing = index !== -1 ? current[index] : SAMPLE_DEPARTURES.find((s) => s.id === dep.id);

    const merged: DepartureItem = {
      ...(existing || {}),
      ...(dep as DepartureItem),
      id: dep.id,
      slug: dep.slug || existing?.slug || (dep.title ? dep.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") : dep.id),
      packageSlug: dep.packageSlug !== undefined ? dep.packageSlug : (existing?.packageSlug || ""),
      title: dep.title || existing?.title || "Holiday Tour Departure",
      destination: dep.destination || existing?.destination || "Destination",
      startDate: dep.startDate || existing?.startDate || new Date().toISOString().split("T")[0],
      endDate: dep.endDate || existing?.endDate || dep.startDate || new Date().toISOString().split("T")[0],
      seasonTag: dep.seasonTag || existing?.seasonTag || "Upcoming Departure",
      totalSeats: Number(dep.totalSeats ?? existing?.totalSeats ?? 20),
      availableSeats: Number(dep.availableSeats ?? existing?.availableSeats ?? 5),
      price: Number(dep.price ?? existing?.price ?? 50000),
      originalPrice: Number(dep.originalPrice ?? existing?.originalPrice ?? 65000),
      image: dep.image || existing?.image || "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
      status: Number(dep.availableSeats ?? existing?.availableSeats ?? 5) <= 3 ? "FILLING_FAST" : (dep.status || existing?.status || "UPCOMING"),
      duration: dep.duration || existing?.duration || "6 Days / 5 Nights",
      overview: dep.overview || existing?.overview || `Guaranteed group tour departure to ${dep.destination || existing?.destination}.`,
      highlights: dep.highlights || existing?.highlights,
      itinerary: dep.itinerary || existing?.itinerary,
      inclusions: dep.inclusions || existing?.inclusions,
      exclusions: dep.exclusions || existing?.exclusions,
      gallery: dep.gallery || existing?.gallery,
    };

    if (index !== -1) {
      current[index] = merged;
    } else {
      current.push(merged);
    }
    updatedDep = merged;
  } else {
    const newId = `dep-${Date.now().toString().slice(-4)}`;
    const newSlug = dep.slug || (dep.title ? dep.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") : newId);
    updatedDep = {
      id: newId,
      slug: newSlug,
      packageSlug: dep.packageSlug || "",
      title: dep.title || "New Holiday Departure",
      destination: dep.destination || "Destination",
      startDate: dep.startDate || new Date().toISOString().split("T")[0],
      endDate: dep.endDate || dep.startDate || new Date().toISOString().split("T")[0],
      seasonTag: dep.seasonTag || "Upcoming Departure",
      totalSeats: Number(dep.totalSeats || 20),
      availableSeats: Number(dep.availableSeats || 20),
      price: Number(dep.price || 50000),
      originalPrice: Number(dep.originalPrice || 60000),
      image: dep.image || "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
      status: "UPCOMING",
      duration: dep.duration || "6 Days / 5 Nights",
      overview: dep.overview || `Guaranteed group tour departure to ${dep.destination || "Destination"}.`,
      highlights: dep.highlights || [],
      itinerary: dep.itinerary || [],
      inclusions: dep.inclusions || [],
      exclusions: dep.exclusions || [],
      gallery: dep.gallery || [],
    };
    current.push(updatedDep);
  }

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DEPARTURES_FILE, JSON.stringify(current, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing departures file:", err);
  }

  // Also try Prisma if initialized
  try {
    if (prisma && prisma.upcomingDeparture && typeof prisma.upcomingDeparture.upsert === "function") {
      prisma.upcomingDeparture.upsert({
        where: { id: updatedDep.id },
        update: {
          title: updatedDep.title,
          destination: updatedDep.destination,
          startDate: updatedDep.startDate,
          endDate: updatedDep.endDate,
          seasonTag: updatedDep.seasonTag,
          totalSeats: updatedDep.totalSeats,
          availableSeats: updatedDep.availableSeats,
          price: updatedDep.price,
          originalPrice: updatedDep.originalPrice,
          image: updatedDep.image,
          status: updatedDep.status,
        },
        create: {
          id: updatedDep.id,
          title: updatedDep.title,
          destination: updatedDep.destination,
          startDate: updatedDep.startDate,
          endDate: updatedDep.endDate,
          seasonTag: updatedDep.seasonTag,
          totalSeats: updatedDep.totalSeats,
          availableSeats: updatedDep.availableSeats,
          price: updatedDep.price,
          originalPrice: updatedDep.originalPrice,
          image: updatedDep.image,
          status: updatedDep.status,
        },
      }).catch(() => null);
    }
  } catch (e) {}

  return updatedDep;
}

export function deleteStoredDeparture(id: string): boolean {
  const current = getStoredDepartures();
  const filtered = current.filter((d) => d.id !== id);
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DEPARTURES_FILE, JSON.stringify(filtered, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error deleting from departures file:", err);
    return false;
  }
}

export async function getDepartureById(id: string): Promise<DepartureItem | null> {
  const storedList = getStoredDepartures();
  const cleanId = decodeURIComponent(id).toLowerCase().trim();

  // Match by exact ID, custom slug, or linked packageSlug
  const matched = storedList.find(
    (d) =>
      d.id.toLowerCase() === cleanId ||
      (d.slug && d.slug.toLowerCase() === cleanId) ||
      (d.packageSlug && (d.packageSlug.toLowerCase() === cleanId || d.packageSlug.toLowerCase().endsWith(`/${cleanId}`)))
  );

  if (matched) {
    return matched;
  }

  // Fallback search by title or destination substring within stored departures
  const bySlug = storedList.find(
    (d) =>
      d.title.toLowerCase().includes(cleanId) ||
      d.destination.toLowerCase().includes(cleanId)
  );
  return bySlug || null;
}

