"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  FileText,
  Search,
  ExternalLink,
  CheckCircle2,
  Clock,
  Banknote,
  AlertTriangle,
  HelpCircle,
  Building,
  UserCheck,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Sparkles,
  Phone,
  ShieldCheck,
  ArrowRight,
  Globe2,
  Bookmark,
  Share2,
  Check,
  Briefcase,
  Users,
  Plane,
  FileCheck2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildCustomWhatsAppLink } from "@/lib/whatsapp";

export interface IatsVisaCountry {
  id: string;
  name: string;
  flag: string;
  region: "Asia" | "Europe" | "North America" | "Oceania" | "Africa" | "Middle East";
  visaType: string;
  processingTime: string;
  fees: string;
  badge: "Online e-Visa" | "Embassy & VFS" | "Digital ETA" | "Arrival Card";
  summary: string;
  officialLinks: { label: string; url: string }[];
  steps?: string[];
  eligibilityRules?: string[];
  ineligibleList?: string[];
  documentChecklist: {
    title: string;
    iconType?: "personal" | "employment" | "family" | "travel" | "sponsor";
    items: string[];
  }[];
  specialNotes?: string[];
  usQuestionnaire?: {
    personal: string[];
    education: string[];
    employment: string[];
    renewalRule?: string;
  };
  schengenCountries?: string[];
}

export const IATS_VISA_DATA: IatsVisaCountry[] = [
  {
    id: "hong-kong",
    name: "Hong Kong",
    flag: "🇭🇰",
    region: "Asia",
    visaType: "Entry for Visit / Transit (Online e-Visa)",
    processingTime: "2 – 4 Weeks",
    fees: "Government Online Rate / Nominal",
    badge: "Online e-Visa",
    summary:
      "All applications are submitted directly online via the Hong Kong Immigration Department portal. Requires detailed applicant financial standing, flight itinerary, and sponsor documentation.",
    officialLinks: [
      {
        label: "Apply for Entry / Transit in Hong Kong",
        url: "https://www.gov.hk/en/nonresidents/visarequire/visasentrypermits/applyvisit_transit.htm",
      },
      {
        label: "Hong Kong Application Status Enquiry",
        url: "https://www.gov.hk/en/residents/immigration/nonpermanent/appstatusenq.htm",
      },
    ],
    documentChecklist: [
      {
        title: "Applicant Documentation",
        iconType: "personal",
        items: [
          "Applicant’s valid travel document containing personal particulars, issue date, expiry date, and details of any re-entry visa held.",
          "Recent photograph of the applicant.",
          "Proof of financial standing: bank statements, savings passbooks, tax receipts, etc.",
          "Proof of employment: company leave approval letter, recent salary slips, etc.",
          "Proof of transportation arrangement: confirmed flight itinerary.",
          "Proof of leisure visit: receipt of package tour booking to Hong Kong, complete daily itinerary.",
          "Proof of visit to next destination after Hong Kong with itinerary (if applying for transit).",
          "For business visits: employer confirmation letter, invitation letter from local Hong Kong company, or trade exhibition pass.",
          "Proof of relationship with local sponsor (if applying for family visit).",
        ],
      },
      {
        title: "Sponsor Documentation",
        iconType: "sponsor",
        items: [
          "Company chop (for corporate sponsor applications).",
          "Business Registration Certificate (for corporate sponsor applications).",
          "Hong Kong ID Card / Travel Document pages showing personal particulars, latest stay limit / landing slip, or latest e-Visa (for individual sponsors).",
          "Other relevant supporting documentation requested by immigration.",
        ],
      },
    ],
  },
  {
    id: "japan",
    name: "Japan",
    flag: "🇯🇵",
    region: "Asia",
    visaType: "Short-Term Tourist Visa (VFS Center)",
    processingTime: "Up to 5 business days",
    fees: "¥3,000 Single (~NPR 2,700) | ¥6,000 Double/Multiple (~NPR 5,300) | VFS Fee: NPR 2,083",
    badge: "Embassy & VFS",
    summary:
      "Submitted via the VFS Global Japan Visa Center in Kathmandu. Requires original completed visa form, financial proof, day-by-day travel itinerary in Japan, and scheduled biometric appointment.",
    officialLinks: [
      {
        label: "Book Japan VFS Appointment (Kathmandu)",
        url: "https://visa.vfsglobal.com/npl/en/jpn/book-an-appointment",
      },
    ],
    steps: [
      "1. Fill out Japan Tourist Visa application form online or print and complete neatly.",
      "2. Schedule your appointment at VFS Global Kathmandu (VFS service fee NPR 2,083.00 applies).",
      "3. Attend appointment in person with all required original documents and forms.",
      "4. Pay Japan embassy visa fees in cash at counter (Single: ¥3,000 / Double: ¥6,000 / Transit: ¥700).",
      "5. Receive passport with approved sticker visa upon notification (normally 5 business days).",
    ],
    documentChecklist: [
      {
        title: "Required Documents Checklist",
        iconType: "personal",
        items: [
          "Original valid passport with at least one blank page.",
          "Completed Japan Visa application form with signature.",
          "Photograph (2 × 2 inches) taken within the previous 6 months attached to application form.",
          "Letter of guarantee (if applicable).",
          "Invitation letter from host in Japan (if applicable).",
          "List of Japanese visa applicants (for group/family submissions).",
          "Detailed day-by-day itinerary in Japan with intended accommodation details.",
          "Original 6-month bank statement showing sufficient funds.",
        ],
      },
    ],
    specialNotes: [
      "Fees are subject to embassy revision and must be paid in Cash only.",
      "Common reasons for denial: insufficient passport validity, errors in submitted documents, previous refusal within 6 months, or applying outside country of residence.",
    ],
  },
  {
    id: "thailand",
    name: "Thailand",
    flag: "🇹🇭",
    region: "Asia",
    visaType: "Official Thailand e-Visa & Digital Arrival Card (TDAC)",
    processingTime: "3 – 5 Business Days",
    fees: "Standard Embassy e-Visa Fee / Package Support",
    badge: "Online e-Visa",
    summary:
      "100% online electronic visa submission via Thai e-Visa official portal, complemented by the mandatory Thailand Digital Arrival Card (TDAC) prior to border entry.",
    officialLinks: [
      {
        label: "Official Thailand e-Visa Portal",
        url: "https://thaievisa.go.th/",
      },
      {
        label: "Thailand Digital Arrival Card (TDAC)",
        url: "https://tdac.immigration.go.th/arrival-card/#/tac/arrival-card/add",
      },
    ],
    steps: [
      "1. Create an account on the official Thai e-Visa portal.",
      "2. Fill in the online visa application form accurately.",
      "3. Upload scanned copies of supporting documents and photographs.",
      "4. Pay the visa fee securely online via debit/credit card.",
      "5. Wait for online consular verification and processing.",
      "6. Receive approved e-Visa confirmation document via email to print for travel.",
    ],
    documentChecklist: [
      {
        title: "Document Requirements",
        iconType: "personal",
        items: [
          "Original passport with validity of more than 6 months.",
          "MRP-size photograph with clear white background (taken within last 6 months).",
          "Original 6-month bank statements signed and stamped by the bank manager (not more than 10 days old).",
          "Marriage certificate (if husband and wife travel together).",
          "Relationship certificate (if family members travel together).",
          "Birth certificate (for minor applicants).",
          "Confirmed round-trip flight reservation.",
          "Confirmed hotel booking covering all nights in Thailand.",
        ],
      },
    ],
  },
  {
    id: "uae",
    name: "UAE (Abu Dhabi / Sharjah)",
    flag: "🇦🇪",
    region: "Middle East",
    visaType: "Tourist Visa (Federal & Sharjah Immigration)",
    processingTime: "3 – 5 Working Days",
    fees: "Without Deposit: NPR 45,000 | With Deposit: NPR 35,000 (Refundable, SWIFT charge NPR 5k–7k)",
    badge: "Online e-Visa",
    summary:
      "Direct online visa processing through UAE immigration authorities. Mandates original police clearance report, healthy bank statement, and valid travel insurance.",
    officialLinks: [],
    documentChecklist: [
      {
        title: "Mandatory UAE Documents",
        iconType: "personal",
        items: [
          "Original passport with at least 2 blank pages.",
          "MRP-size photograph with white background.",
          "Original 6-month bank statement (salary account preferred, minimum balance NPR 200,000–300,000).",
          "Police report is strictly mandatory for Nepali applicants.",
          "Travel insurance with comprehensive medical coverage valid across the UAE.",
          "Marriage certificate (if traveling with spouse).",
          "Relationship certificate (if traveling with family members).",
          "Birth certificate for minor children.",
          "No previous GCC blacklisting or overstay record.",
        ],
      },
    ],
    specialNotes: [
      "Fee options: NPR 45,000 without security deposit, or NPR 35,000 with refundable deposit (plus SWIFT bank transfer charges NPR 5,000–7,000).",
      "Previous GCC overstays or visa issues may significantly increase risk of rejection.",
    ],
  },
  {
    id: "indonesia",
    name: "Indonesia (Bali)",
    flag: "🇮🇩",
    region: "Asia",
    visaType: "Official e-Visa (Stay Up to 60 Days, Extendable)",
    processingTime: "Within 5 working days",
    fees: "IDR 1,000,000 (~USD 55) Government Fee / USD 150 Full Assistance",
    badge: "Online e-Visa",
    summary:
      "Convenient online e-Visa issued by Indonesian Immigration allowing up to 60 days of leisure stay, plus mandatory online Indonesia Arrival Card submission.",
    officialLinks: [
      {
        label: "Official Indonesia e-Visa Portal",
        url: "https://evisa.imigrasi.go.id/",
      },
      {
        label: "Indonesia Digital Arrival Card",
        url: "https://allindonesia.imigrasi.go.id/arrival-card-submission/personal-information",
      },
    ],
    documentChecklist: [
      {
        title: "Indonesia Document Checklist",
        iconType: "personal",
        items: [
          "Passport valid for at least 6 months (12 months for emergency/identity travel documents).",
          "Personal bank statement showing minimum USD 2,000 (or equivalent) for the last 3 months.",
          "Recent color photograph (MRP standard, white background).",
          "Confirmed round-trip flight reservation.",
          "Hotel booking confirmation in Indonesia / Bali.",
          "Marriage certificate (if couple) & relationship/birth certificates for minors.",
        ],
      },
    ],
  },
  {
    id: "sri-lanka",
    name: "Sri Lanka",
    flag: "🇱🇰",
    region: "Asia",
    visaType: "Electronic Travel Authorization (ETA)",
    processingTime: "24 – 48 Hours",
    fees: "Official Government ETA Rate (Online Card Payment)",
    badge: "Digital ETA",
    summary:
      "Nepalese passport holders are fully eligible for online ETA prior to departure. Simple online filing with instant electronic approval delivered via email.",
    officialLinks: [
      {
        label: "Official Sri Lanka ETA Government Portal",
        url: "https://eta.gov.lk/slvisa/",
      },
    ],
    documentChecklist: [
      {
        title: "Online Application Checklist",
        iconType: "personal",
        items: [
          "Passport valid for a minimum of 6 months from intended date of arrival.",
          "Intended arrival date & port of entry (typically Colombo – CMB).",
          "Active email address (approval notification sent electronically).",
          "Valid debit or credit card (Visa / MasterCard) for fee payment.",
        ],
      },
      {
        title: "Documents to Carry at Immigration",
        iconType: "travel",
        items: [
          "Printed copy of ETA approval notice.",
          "Confirmed return / onward international air ticket.",
          "Hotel booking voucher or host address in Sri Lanka.",
          "Proof of sufficient funds (cash, recent bank statement, or international card).",
          "Travel insurance (strongly recommended).",
        ],
      },
    ],
    specialNotes: [
      "Avoid third-party fake websites — use only the official eta.gov.lk website.",
      "Ensure passport number, name spelling, and nationality match exactly to avoid boarding denial.",
    ],
  },
  {
    id: "vietnam",
    name: "Vietnam",
    flag: "🇻🇳",
    region: "Asia",
    visaType: "Tourist e-Visa / Visa on Arrival",
    processingTime: "3 – 5 Business Days",
    fees: "USD 35 Standard | USD 25 with SkyWalk Tour Package",
    badge: "Online e-Visa",
    summary:
      "Rapid electronic visa processing for leisure travelers to Hanoi, Da Nang, and Ho Chi Minh City. Special visa-on-arrival exemption applies for Phu Quoc Island.",
    officialLinks: [],
    documentChecklist: [
      {
        title: "Vietnam Requirements",
        iconType: "personal",
        items: [
          "Passport with minimum 6 months validity from travel date.",
          "MRP-size photograph with white background (not older than 6 months).",
          "Visa Fee: USD 35 (or discounted to USD 25 when booked with SkyWalk package).",
          "Confirmed flight schedule & hotel reservation.",
        ],
      },
    ],
    specialNotes: [
      "Visa on Arrival is available specifically when traveling directly to Phu Quoc Island under special tourist economic zone rules.",
    ],
  },
  {
    id: "kenya",
    name: "Kenya",
    flag: "🇰🇪",
    region: "Africa",
    visaType: "Electronic Travel Authorization (eTA)",
    processingTime: "3 Business Days",
    fees: "Official Kenya Government eTA Fee",
    badge: "Digital ETA",
    summary:
      "All international travelers to Kenya must apply for an electronic travel authorization (eTA) through the official government immigration portal prior to arrival.",
    officialLinks: [
      {
        label: "Official Kenya eTA Portal",
        url: "https://etakenya.go.ke/",
      },
    ],
    documentChecklist: [
      {
        title: "Kenya eTA Checklist",
        iconType: "personal",
        items: [
          "Valid passport with at least 6 months remaining validity.",
          "Recent passport-style photograph.",
          "Flight itinerary showing arrival and departure details.",
          "Hotel booking confirmation or invitation letter.",
          "Valid payment card for online processing fee.",
        ],
      },
    ],
  },
  {
    id: "malaysia",
    name: "Malaysia",
    flag: "🇲🇾",
    region: "Asia",
    visaType: "Tourist eVISA & MDAC (Digital Arrival Card)",
    processingTime: "1 – 3 Business Days",
    fees: "NPR 6,500 Complete Service Charge",
    badge: "Online e-Visa",
    summary:
      "Electronic tourist visa for Kuala Lumpur, Penang, and Langkawi. Travelers must also register the Malaysia Digital Arrival Card (MDAC) within 3 days before entry.",
    officialLinks: [
      {
        label: "Malaysia Digital Arrival Card (MDAC)",
        url: "https://imigresen-online.imi.gov.my/mdac/main?registerMain",
      },
    ],
    documentChecklist: [
      {
        title: "Malaysia Documents Checklist",
        iconType: "personal",
        items: [
          "Original valid passport with clear pages.",
          "MRP-size photograph with white background.",
          "Original 6-month bank statement with consistent transactions.",
          "Flight reservation with confirmed arrival and departure dates.",
          "Hotel booking confirmation voucher.",
          "Marriage certificate (if traveling together with spouse).",
          "Relationship certificate & birth certificates for minor family members.",
          "Travel insurance (optional but strongly recommended).",
        ],
      },
    ],
  },
  {
    id: "singapore",
    name: "Singapore",
    flag: "🇸🇬",
    region: "Asia",
    visaType: "SG Arrival Card (SGAC) with Electronic Health Declaration",
    processingTime: "Instant Online Submission (Within 3 Days Before Arrival)",
    fees: "Free Official Electronic Submission",
    badge: "Arrival Card",
    summary:
      "All travelers entering Singapore must complete the mandatory SG Arrival Card electronically prior to immigration clearance, alongside valid entry visa documentation.",
    officialLinks: [
      {
        label: "ICA Official SG Arrival Card Portal",
        url: "https://eservices.ica.gov.sg/sgarrivalcard/",
      },
    ],
    documentChecklist: [
      {
        title: "SGAC Requirements",
        iconType: "travel",
        items: [
          "Valid passport with minimum 6 months validity.",
          "Flight details & arrival flight number.",
          "Hotel address or accommodation details in Singapore.",
          "Online health declaration answers.",
        ],
      },
    ],
  },
  {
    id: "turkey",
    name: "Turkey",
    flag: "🇹🇷",
    region: "Europe",
    visaType: "Official e-Visa (Conditional Entry)",
    processingTime: "Instant / 24 Hours",
    fees: "Official Government e-Visa Fee",
    badge: "Online e-Visa",
    summary:
      "Eligible for Nepali citizens holding a valid Schengen, UK, USA, or Ireland visa. Simple 3-step process: apply, pay, and download PDF. Travel must be by air.",
    officialLinks: [
      {
        label: "Turkey e-Visa Application Portal",
        url: "https://dtvgroup.com.tr/",
      },
    ],
    steps: [
      "1. Apply online on the official portal with passport and eligible supporting visa details.",
      "2. Make payment securely via Visa/MasterCard.",
      "3. Download approved Turkey e-Visa PDF immediately for boarding.",
    ],
    eligibilityRules: [
      "Applicant MUST hold a valid Schengen visa (sticker visa, single or multiple entry).",
      "OR a valid UK Visa (UK transit visa is NOT accepted).",
      "OR a valid USA Visa.",
      "OR a valid Ireland Visa.",
      "The supporting visa MUST be valid on the date of entry into Turkey.",
      "Passport validity must be a minimum of 6 months from Turkey travel date.",
    ],
    ineligibleList: [
      "UAE tourist visa holders are NOT eligible for Turkey e-Visa.",
      "Australia visa holders are NOT eligible.",
      "Japan visa holders are NOT eligible.",
      "South Korea visa holders are NOT eligible.",
      "Canada visa holders are NOT eligible.",
      "Any GCC visa (Saudi, Qatar, Oman, Kuwait, Bahrain) is NOT eligible.",
    ],
    documentChecklist: [
      {
        title: "Required Turkey Documents",
        iconType: "personal",
        items: [
          "Passport valid for at least 6 months with clear scan of bio page.",
          "Clear scanned copy of valid Schengen, UK, USA, or Ireland sticker visa.",
          "Intended travel entry and exit dates for Turkey.",
          "Active email address for electronic e-Visa delivery.",
          "Confirmed round-trip airline tickets.",
          "Confirmed hotel booking in Turkey.",
          "Proof of sufficient funds for stay.",
        ],
      },
    ],
  },
  {
    id: "canada",
    name: "Canada",
    flag: "🇨🇦",
    region: "North America",
    visaType: "Temporary Resident Visa (TRV - Tourist)",
    processingTime: "Biometrics in 2–3 days | Total 2 Months",
    fees: "NPR 30,000 Net Per Person (Visa Fee & Service Charge)",
    badge: "Embassy & VFS",
    summary:
      "Mandatory online application via IRCC portal followed by VFS biometrics in Kathmandu. Strict requirements for property valuation, CA report, and ties to home country.",
    officialLinks: [
      {
        label: "IRCC Official Canada Application Portal",
        url: "https://portal-portail.apps.cic.gc.ca/signin?lang=en",
      },
      {
        label: "VFS Global Canada Biometrics Portal",
        url: "https://www.vfsglobal.ca/IRCC-AppointmentWave1",
      },
    ],
    documentChecklist: [
      {
        title: "Personal Documents (All Applicants)",
        iconType: "personal",
        items: [
          "Original passport with minimum validity of 6 months.",
          "English-translated, notarized copy of citizenship certificate.",
          "Letter of invitation from Canadian host person or organization (if applicable).",
          "3 months payslips and citizenship/PR copy of host person (if applicable).",
          "Visa request / cover letter (contact SkyWalk for professional assistance).",
          "Copies and stamps of all visas held in the last 5 years.",
          "Original 6-month bank statement from a commercial bank with healthy balance.",
          "Relationship certificate with all family members (notarized copy).",
          "Personal savings (Fixed Deposit certificates).",
          "Additional source of income proof (land/house rent agreements, etc.).",
          "Property valuation report & Chartered Accountant (CA) report (MANDATORY for first-time applicants).",
        ],
      },
      {
        title: "Self-Employed / Business Documents",
        iconType: "employment",
        items: [
          "Company registration certificate & PAN/VAT certificate (English translated & notarized).",
          "Tax clearance certificates for the last 2 consecutive fiscal years.",
          "All related corporate memorandum, articles of association, and licenses.",
          "Audit report of the most recent fiscal year.",
        ],
      },
      {
        title: "Employee Official Documents",
        iconType: "employment",
        items: [
          "Official leave approval letter on employer letterhead.",
          "Recent 2 years tax clearance certificates (English translated & notarized).",
          "Recent 3–6 months salary slips and bank statement.",
        ],
      },
      {
        title: "Family & Travel Proof",
        iconType: "family",
        items: [
          "Marriage certificate (if husband and wife travel together).",
          "Child birth certificate (if minor child travels together).",
          "Leave approval letter from school / college for students.",
          "Round-trip flight reservation.",
          "Hotel reservation for entire stay in Canada.",
        ],
      },
    ],
    specialNotes: [
      "Biometrics appointment is normally scheduled within 2–3 working days after online submission.",
      "Passport submission & return collection takes approximately 3 weeks after handover to VFS.",
    ],
  },
  {
    id: "australia",
    name: "Australia",
    flag: "🇦🇺",
    region: "Oceania",
    visaType: "Visitor Visa (Subclass 600 - Tourist Stream)",
    processingTime: "Biometrics in 2–3 days | 3 Days to 2 Months",
    fees: "NPR 32,500 Net Per Person (Visa Fee & Processing Charge)",
    badge: "Embassy & VFS",
    summary:
      "Online filing via Australian Home Affairs ImmiAccount portal, followed by biometrics collection at VFS Global Kathmandu. High emphasis on proof of genuine temporary stay and financial solvency.",
    officialLinks: [
      {
        label: "Department of Home Affairs ImmiAccount",
        url: "https://online.immi.gov.au/lusc/login",
      },
    ],
    documentChecklist: [
      {
        title: "Personal Documents (All Applicants)",
        iconType: "personal",
        items: [
          "Original passport with valid blank pages.",
          "English-translated, notarized copy of citizenship certificate.",
          "Letter of invitation from Australia and relationship proof with host (if any).",
          "Professional visa request / SOP letter (contact SkyWalk for sample drafting).",
          "Recent visa copies and immigration stamps from the last 5 years.",
          "Original 6-month bank statement from a recognized commercial bank.",
          "Relationship certificate with all family members.",
          "Fixed deposit receipts and personal savings proofs.",
          "Additional income sources (house/land rental contracts, dividend slips).",
          "Property valuation and CA report (mandatory for first-time applicants).",
        ],
      },
      {
        title: "Employment & Business Proof",
        iconType: "employment",
        items: [
          "For employees: Official leave approval letter from organization and 2 years tax certificates.",
          "For self-employed: Company registration, PAN/VAT, 2 years tax clearance, and latest audit report.",
        ],
      },
      {
        title: "Family & Travel Reservations",
        iconType: "travel",
        items: [
          "Marriage certificate, children birth certificates, and school leave letters for students.",
          "Round-trip air ticket reservation.",
          "Hotel reservations for entire stay (not mandatory if hosted by relatives/friends).",
        ],
      },
    ],
  },
  {
    id: "new-zealand",
    name: "New Zealand",
    flag: "🇳🇿",
    region: "Oceania",
    visaType: "Visitor Visa (General Tourist)",
    processingTime: "Minimum 3 Days to 1 Month",
    fees: "NPR 50,000 Net Per Person (Visa Fee & Processing Charge)",
    badge: "Embassy & VFS",
    summary:
      "Comprehensive visitor visa application submitted online to Immigration New Zealand. Requires robust financial portfolio, ties to Nepal, and verified itinerary.",
    officialLinks: [
      {
        label: "Immigration New Zealand Visitor Visa Portal",
        url: "https://www.immigration.govt.nz/visas/visitor-visa/",
      },
    ],
    documentChecklist: [
      {
        title: "Required Documents",
        iconType: "personal",
        items: [
          "Original passport.",
          "English-translated, notarized copy of citizenship certificate.",
          "Letter of invitation from New Zealand host with relationship proof (if any).",
          "Visa request letter explaining travel itinerary and ties to Nepal.",
          "Recent visa copies/stamps from last 5 years (Australian visa is advantageous).",
          "Original 6-month bank statement from a commercial bank.",
          "Relationship certificate with all immediate family members.",
          "Personal savings, Fixed Deposit certificates, and additional income proof.",
          "Property valuation and CA report (mandatory for first-time applicants).",
          "Employer leave letter or self-employed company documents (Reg, PAN, Tax, Audit).",
          "Round-trip flight reservation & hotel booking confirmation.",
        ],
      },
    ],
  },
  {
    id: "schengen",
    name: "Schengen Area (29 European Nations)",
    flag: "🇪🇺",
    region: "Europe",
    visaType: "Uniform Schengen Tourist Visa (Type C - Short Stay)",
    processingTime: "Minimum 3 Days to 1 Month",
    fees: "NPR 15,000 Net Processing Charge + Embassy/VFS Fees",
    badge: "Embassy & VFS",
    summary:
      "A single visa granting free travel across 29 European countries. Applications submitted to the primary destination country's embassy (e.g. France-Visas via VFS Kathmandu).",
    officialLinks: [
      {
        label: "France-Visas Official Online Portal",
        url: "https://france-visas.gouv.fr/en/online-application",
      },
      {
        label: "VFS Global France/Schengen (Kathmandu)",
        url: "https://visa.vfsglobal.com/NPL/en/FRA/login",
      },
      {
        label: "Official Schengen Area Information",
        url: "https://www.schengenvisainfo.com/schengen-area",
      },
    ],
    schengenCountries: [
      "Austria",
      "Bulgaria",
      "Belgium",
      "Czech Republic",
      "Croatia",
      "Denmark",
      "Estonia",
      "Finland",
      "France",
      "Germany",
      "Greece",
      "Hungary",
      "Iceland",
      "Italy",
      "Latvia",
      "Liechtenstein",
      "Lithuania",
      "Luxembourg",
      "Malta",
      "Netherlands",
      "Norway",
      "Poland",
      "Portugal",
      "Romania",
      "Slovakia",
      "Slovenia",
      "Spain",
      "Sweden",
      "Switzerland",
    ],
    documentChecklist: [
      {
        title: "Personal & Financial Documents",
        iconType: "personal",
        items: [
          "Original passport with validity of at least 3 months beyond departure from Schengen.",
          "English-translated, notarized copy of citizenship certificate.",
          "Travel medical insurance covering entire stay with minimum coverage of €30,000 (repatriation & medical emergency).",
          "Original 6-month bank statement from a commercial bank with consistent transaction trail.",
          "Personal savings, fixed deposit slips, and property valuation / CA report (mandatory for first-time applicants).",
          "Relationship certificate with all family members (notarized).",
          "Visa request / cover letter detailing travel itinerary and accommodation.",
        ],
      },
      {
        title: "Employment & Business Documentation",
        iconType: "employment",
        items: [
          "For employees: Official leave approval letter from employer and recent 2 years tax clearance certificates.",
          "For self-employed: Company registration, PAN/VAT certificates, last 2 years tax clearance, and latest fiscal audit report.",
        ],
      },
      {
        title: "Family & Travel Bookings",
        iconType: "travel",
        items: [
          "Marriage certificate (for couples) & minor child birth certificates.",
          "School/college leave letters for student travelers.",
          "Round-trip flight reservation.",
          "Hotel reservation for entire stay across all Schengen member states visited.",
        ],
      },
    ],
  },
  {
    id: "uk",
    name: "United Kingdom",
    flag: "🇬🇧",
    region: "Europe",
    visaType: "Standard Visitor Visa (6 Months Leisure / Visit)",
    processingTime: "Minimum 3 Days to 35 Days",
    fees: "NPR 37,500 Net Per Person (Visa Fee & Processing Charge)",
    badge: "Embassy & VFS",
    summary:
      "Mandatory electronic filing via GOV.UK followed by biometric enrolment at VFS Global Kathmandu. Requires thorough proof of income origin, employment ties, and financial solvency.",
    officialLinks: [
      {
        label: "GOV.UK & VFS Global Apply Visa Portal",
        url: "https://visa.vfsglobal.com/npl/en/gbr/apply-visa",
      },
    ],
    documentChecklist: [
      {
        title: "UK Document Checklist",
        iconType: "personal",
        items: [
          "Original passport and English-translated, notarized copy of citizenship certificate.",
          "Letter of invitation from UK host (if any) with relationship proof.",
          "Visa request cover letter with clear travel budget and itinerary.",
          "Recent visa copies and passport stamps from the last 5 years.",
          "Original 6-month bank statement from a commercial bank.",
          "Relationship certificate with all family members.",
          "Personal savings, Fixed Deposit certificates, and additional income sources.",
          "Property valuation and CA report (mandatory for first-time applicants).",
          "For employees: Leave letter and 2 years tax certificates.",
          "For business owners: Company registration, PAN/VAT, 2 years tax clearance, and audit report.",
          "Round-trip flight booking and hotel accommodation reservations.",
        ],
      },
    ],
  },
  {
    id: "usa",
    name: "United States of America",
    flag: "🇺🇸",
    region: "North America",
    visaType: "B1/B2 Non-Immigrant Visitor Visa (DS-160)",
    processingTime: "Interview slot after 6–14 months | 3–7 Days post passport submission",
    fees: "NPR 35,000 Net Per Person (Visa Fee & Processing Charge)",
    badge: "Embassy & VFS",
    summary:
      "DS-160 online questionnaire, SEVIS/CGI portal fee payment, and in-person embassy interview at US Embassy Kathmandu. Renewal applicants within 48 months of expiry may qualify for interview waiver in ~2 weeks.",
    officialLinks: [
      {
        label: "CEAC State Gov DS-160 Application Portal",
        url: "https://ceac.state.gov/genniv/",
      },
    ],
    usQuestionnaire: {
      renewalRule:
        "US Visa Renewal: If renewing a previous US visa not older than 48 months from expiry, interview is waived and processing takes approximately 2 weeks only.",
      personal: [
        "List of all countries visited in the last 5 years.",
        "Planned date of visit and travel duration in the USA.",
        "Father’s full name and date of birth.",
        "Mother’s full name and date of birth.",
        "Spouse’s full name and date of birth.",
        "Family members/relatives in the US: full name, detailed address with ZIP code, company name, mobile number, and email.",
        "Your Facebook ID and social media handles.",
        "Have you ever applied for an immigrant petition?",
        "Have you ever served in a government or military/army role?",
      ],
      education: [
        "Plus Two (+2) and all higher degrees (most recent degree details mandatory).",
        "College / University name, physical location, and contact number.",
        "Course name, start date, and completion date.",
      ],
      employment: [
        "Company name, office location, joining date, and contact number.",
        "If Job Holder: Supervisor’s name, monthly salary, and job description in 5 sentences.",
        "If Business Owner: Exact business description and operations (contact SkyWalk for sample drafting).",
        "For Retired Applicants: Full details of the latest held job prior to retirement.",
      ],
    },
    documentChecklist: [
      {
        title: "All Applicants Core Checklist",
        iconType: "personal",
        items: [
          "Original passport scan copy and citizenship certificate copy.",
          "Photograph (2 × 2 inches) with pure white background (digital file for DS-160 + hard copy on interview day).",
          "Personal email address, active mobile number, home number, and office contact.",
          "Interview appointment confirmation sheet and DS-160 confirmation barcode.",
        ],
      },
    ],
    specialNotes: [
      "Interview dates for new applicants currently fall around 6 to 14 months out, but emergency expedited requests and earlier rescheduling slots can be monitored and arranged subject to embassy availability.",
    ],
  },
];

export default function IatsVisaGuideBook() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [expandedCountryId, setExpandedCountryId] = useState<string>("hong-kong");
  const [activeTab, setActiveTab] = useState<Record<string, "docs" | "steps" | "links">>(
    {}
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const regions = ["All", "Asia", "Europe", "North America", "Oceania", "Middle East"];

  const filteredCountries = useMemo(() => {
    return IATS_VISA_DATA.filter((country) => {
      const matchesRegion =
        selectedRegion === "All" || country.region === selectedRegion;
      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchesRegion;

      const matchesSearch =
        country.name.toLowerCase().includes(query) ||
        country.visaType.toLowerCase().includes(query) ||
        country.summary.toLowerCase().includes(query) ||
        country.badge.toLowerCase().includes(query) ||
        (country.schengenCountries &&
          country.schengenCountries.some((c) => c.toLowerCase().includes(query)));

      return matchesRegion && matchesSearch;
    });
  }, [searchQuery, selectedRegion]);

  const handleShare = (country: IatsVisaCountry) => {
    const text = `Check out the complete 2026 Tourist Visa Guide for ${country.name} (${country.visaType}) on Skywalk Holidays!`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${text}\nhttps://skywalkholidays.com/services/visa#iats-guide-${country.id}`);
      setCopiedId(country.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <section id="iats-visa-guidebook" className="py-16 md:py-24 bg-[#081220] text-white relative overflow-hidden">
      {/* Decorative Atmosphere Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#0ea5e9]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#f97316]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container-custom relative z-10">
        {/* Official IATS Top Banner Header */}
        <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-sky-500/20 to-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-extrabold tracking-widest uppercase mb-4 shadow-lg backdrop-blur-md">
            <GraduationCap size={16} className="text-amber-400" />
            INSTITUTE FOR AVIATION AND TOURISM SKILLS (IATS) — 2026
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            TOURIST VISA <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] to-[#0ea5e9]">GUIDE BOOK 2026</span>
          </h2>

          <p className="text-white/80 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Your authoritative step-by-step documentation, checklist, fee breakdown, and official government portal directory for 17 global travel destinations.
          </p>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-6 text-xs text-white/70 font-semibold">
            <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
              <Globe2 size={13} className="text-[#38bdf8]" />
              17 Countries &amp; 29 Schengen States
            </span>
            <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
              <FileCheck2 size={13} className="text-emerald-400" />
              Complete Document Checklists
            </span>
            <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
              <Banknote size={13} className="text-amber-400" />
              Verified Fees &amp; VFS Portals
            </span>
          </div>
        </div>

        {/* Search & Region Filter Controls */}
        <div className="max-w-4xl mx-auto mb-10 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <input
              type="text"
              placeholder="Search by country, visa type, or keyword (e.g., Japan, Schengen, USA, e-Visa, Police report)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/90 border border-white/15 focus:border-[#0ea5e9] rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-white/40 outline-none transition-colors shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-white/50 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Region Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {regions.map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  selectedRegion === reg
                    ? "bg-[#0ea5e9] text-white shadow-md shadow-[#0ea5e9]/30"
                    : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10"
                }`}
              >
                {reg === "All" ? `All Countries (${IATS_VISA_DATA.length})` : reg}
              </button>
            ))}
          </div>
        </div>

        {/* Country Visa Guide Accordion / Cards List */}
        <div className="max-w-4xl mx-auto space-y-5">
          {filteredCountries.length === 0 ? (
            <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-10 text-center">
              <AlertTriangle className="mx-auto text-amber-400 mb-3" size={32} />
              <h3 className="text-lg font-bold text-white mb-1">No Visa Guide Found</h3>
              <p className="text-xs text-white/60">
                No matching country or keyword found for &ldquo;{searchQuery}&rdquo;. Try another search term.
              </p>
            </div>
          ) : (
            filteredCountries.map((country, index) => {
              const isExpanded = expandedCountryId === country.id;
              const currentTab = activeTab[country.id] || "docs";

              return (
                <div
                  key={country.id}
                  id={`iats-guide-${country.id}`}
                  className={`bg-slate-900/90 rounded-3xl border transition-all duration-300 overflow-hidden shadow-xl ${
                    isExpanded
                      ? "border-[#0ea5e9]/60 ring-1 ring-[#0ea5e9]/40 bg-slate-900"
                      : "border-white/10 hover:border-white/20"
                  }`}
                >
                  {/* Card Header Bar (Clickable) */}
                  <div
                    onClick={() =>
                      setExpandedCountryId(isExpanded ? "" : country.id)
                    }
                    className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer select-none group"
                  >
                    <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                      {/* Flag Avatar */}
                      <span className="text-3xl sm:text-4xl shrink-0 group-hover:scale-110 transition-transform">
                        {country.flag}
                      </span>

                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-xs font-mono font-bold text-[#38bdf8]">
                            #{String(index + 1).padStart(2, "0")}
                          </span>
                          <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#38bdf8] transition-colors">
                            {country.name}
                          </h3>
                          <span className="bg-[#0ea5e9]/20 text-[#38bdf8] border border-[#0ea5e9]/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                            {country.badge}
                          </span>
                        </div>
                        <p className="text-xs text-white/60 line-clamp-1">
                          {country.visaType}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto shrink-0 border-t sm:border-t-0 border-white/10 pt-3 sm:pt-0">
                      <div className="text-left sm:text-right">
                        <div className="text-[11px] text-white/50 flex items-center sm:justify-end gap-1">
                          <Clock size={11} className="text-[#38bdf8]" />
                          <span>{country.processingTime}</span>
                        </div>
                        <div className="text-xs font-bold text-amber-300 line-clamp-1">
                          {country.fees.split("|")[0]}
                        </div>
                      </div>

                      <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-[#0ea5e9] text-white flex items-center justify-center transition-colors shrink-0">
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Guide Content */}
                  {isExpanded && (
                    <div className="border-t border-white/10 p-5 sm:p-7 bg-[#0b182b]/80 space-y-6">
                      {/* Overview Summary */}
                      <div className="bg-white/5 rounded-2xl p-4 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                          {country.summary}
                        </p>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleShare(country)}
                            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
                            title="Share Guide"
                          >
                            {copiedId === country.id ? (
                              <Check size={14} className="text-emerald-400" />
                            ) : (
                              <Share2 size={14} />
                            )}
                          </button>
                          <Button
                            size="sm"
                            asChild
                            className="bg-[#f97316] hover:bg-[#ea580c] text-white text-xs font-bold rounded-xl"
                          >
                            <a
                              href={buildCustomWhatsAppLink(
                                `Hello Skywalk Holidays! I am inquiring about the ${country.name} Tourist Visa (${country.visaType}) from Nepal.`
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Phone size={13} />
                              Inquire on WhatsApp
                            </a>
                          </Button>
                        </div>
                      </div>

                      {/* Official Portals Box */}
                      {country.officialLinks && country.officialLinks.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-[#38bdf8] flex items-center gap-1.5">
                            <ExternalLink size={13} />
                            Official Government &amp; VFS Portals
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {country.officialLinks.map((link, idx) => (
                              <a
                                key={idx}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between bg-sky-950/50 hover:bg-sky-900/60 border border-sky-500/30 rounded-xl px-3.5 py-2.5 text-xs text-sky-200 hover:text-white transition-all group/link"
                              >
                                <span className="font-semibold truncate mr-2">{link.label}</span>
                                <ExternalLink size={13} className="shrink-0 text-sky-400 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Schengen Countries Breakdown (If Schengen) */}
                      {country.schengenCountries && (
                        <div className="bg-sky-950/30 rounded-2xl p-4 border border-sky-500/20">
                          <h4 className="text-xs font-extrabold uppercase tracking-wider text-sky-300 mb-2.5 flex items-center gap-1.5">
                            <Globe2 size={14} />
                            List of 29 Schengen Member Countries
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {country.schengenCountries.map((member) => (
                              <span
                                key={member}
                                className="bg-white/10 text-white/90 text-[11px] font-medium px-2.5 py-1 rounded-lg border border-white/10"
                              >
                                {member}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Step-by-Step Procedure (If Present) */}
                      {country.steps && country.steps.length > 0 && (
                        <div className="space-y-2.5">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                            <Sparkles size={13} />
                            Application Step-by-Step Guide
                          </h4>
                          <div className="space-y-2">
                            {country.steps.map((st, i) => (
                              <div
                                key={i}
                                className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/10 text-xs text-white/90"
                              >
                                <span className="w-5 h-5 rounded-full bg-[#0ea5e9]/20 text-[#38bdf8] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                                  {i + 1}
                                </span>
                                <span>{st}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Eligibility & Ineligible (For Turkey or similar) */}
                      {country.eligibilityRules && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-4">
                            <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <CheckCircle2 size={14} />
                              Eligibility Conditions (Mandatory)
                            </h4>
                            <ul className="space-y-1.5 text-xs text-white/80">
                              {country.eligibilityRules.map((r, i) => (
                                <li key={i} className="flex items-start gap-1.5">
                                  <span className="text-emerald-400 font-bold">•</span>
                                  <span>{r}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {country.ineligibleList && (
                            <div className="bg-red-950/30 border border-red-500/30 rounded-2xl p-4">
                              <h4 className="text-xs font-bold text-red-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <AlertTriangle size={14} />
                                NOT Eligible for e-Visa
                              </h4>
                              <ul className="space-y-1.5 text-xs text-white/80">
                                {country.ineligibleList.map((r, i) => (
                                  <li key={i} className="flex items-start gap-1.5">
                                    <span className="text-red-400 font-bold">✕</span>
                                    <span>{r}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                      {/* US Questionnaire Details (If USA) */}
                      {country.usQuestionnaire && (
                        <div className="space-y-4 bg-slate-900/90 rounded-2xl p-5 border border-sky-500/30">
                          {country.usQuestionnaire.renewalRule && (
                            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-200">
                              <strong>Renewal Waiver:</strong> {country.usQuestionnaire.renewalRule}
                            </div>
                          )}

                          <h4 className="text-xs font-bold text-[#38bdf8] uppercase tracking-wider">
                            DS-160 Information Requirements
                          </h4>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                            <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 space-y-1.5">
                              <span className="font-bold text-white block mb-1">Personal Details</span>
                              {country.usQuestionnaire.personal.map((item, i) => (
                                <p key={i} className="text-white/70">• {item}</p>
                              ))}
                            </div>

                            <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 space-y-1.5">
                              <span className="font-bold text-white block mb-1">Education Background</span>
                              {country.usQuestionnaire.education.map((item, i) => (
                                <p key={i} className="text-white/70">• {item}</p>
                              ))}
                            </div>

                            <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 space-y-1.5">
                              <span className="font-bold text-white block mb-1">Job / Business Profile</span>
                              {country.usQuestionnaire.employment.map((item, i) => (
                                <p key={i} className="text-white/70">• {item}</p>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Document Checklists Category Blocks */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                          <CheckCircle2 size={14} className="text-emerald-400" />
                          Required Document Checklists
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                          {country.documentChecklist.map((group, gIdx) => (
                            <div
                              key={gIdx}
                              className="bg-slate-900/80 rounded-2xl p-4 border border-white/10 flex flex-col justify-between"
                            >
                              <div>
                                <h5 className="text-xs font-bold text-white mb-2.5 pb-2 border-b border-white/10 flex items-center gap-1.5 text-sky-300">
                                  {group.title}
                                </h5>
                                <ul className="space-y-1.5 text-xs text-white/80">
                                  {group.items.map((item, iIdx) => (
                                    <li key={iIdx} className="flex items-start gap-2">
                                      <CheckCircle2
                                        size={12}
                                        className="text-emerald-400 shrink-0 mt-0.5"
                                      />
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Special Notes & Advice */}
                      {country.specialNotes && (
                        <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-200 space-y-1">
                          <span className="font-bold block uppercase tracking-wider text-amber-300">Important Note:</span>
                          {country.specialNotes.map((note, nIdx) => (
                            <p key={nIdx}>• {note}</p>
                          ))}
                        </div>
                      )}

                      {/* Card Footer Call to Action */}
                      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs border-t border-white/10">
                        <span className="text-white/60 text-[11px]">
                          Need complete filing support, SOP review, or VFS Kathmandu appointment?
                        </span>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <Button
                            asChild
                            size="sm"
                            className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold rounded-xl w-full sm:w-auto"
                          >
                            <a href="#visa-form">Book Consultation</a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* IMPORTANT NOTICE FOR STUDENTS (IATS 2026 OFFICIAL ADVISORY) */}
        <div className="max-w-4xl mx-auto mt-14 bg-gradient-to-br from-amber-950/40 via-slate-900 to-[#0a1628] border-2 border-amber-400/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start gap-5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center shrink-0">
              <GraduationCap size={26} />
            </div>

            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                <AlertTriangle size={13} />
                IMPORTANT NOTICE FOR STUDENTS (IATS – 2026)
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Official Compliance &amp; Verification Advisory
              </h3>

              <div className="text-xs sm:text-sm text-white/80 space-y-2.5 leading-relaxed">
                <p>
                  Students are advised to carefully review all official visa-related links and ensure that they are referring to the most recent and updated information before submitting any visa application.
                </p>
                <p>
                  Visa rules, regulations, and eligibility criteria are subject to change without prior notice. As a result, certain terms and conditions may be revised or updated by the relevant authorities.
                </p>
                <p>
                  It is the student’s responsibility to stay informed about these changes and comply with the latest requirements at the time of application. Failure to follow updated visa guidelines may result in delays, rejection, or other complications in the visa process.
                </p>
              </div>

              <div className="pt-2 text-[11px] text-amber-300/80 font-mono">
                — Institute for Aviation and Tourism Skills (IATS) • Skywalk Tours &amp; Travels Pvt. Ltd. (2026)
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
