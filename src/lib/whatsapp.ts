/**
 * Centralized WhatsApp Business Inquiry Helper
 * Uses environment variable NEXT_PUBLIC_WHATSAPP_NUMBER or defaults to Nepal agency number.
 */

export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "9779714491103";

interface StandardInquiryParams {
  service: string;
  name: string;
  from?: string;
  to?: string;
  destination?: string;
  travelDate?: string;
  passengers?: string;
  whatsappNumber: string;
  additionalDetails?: string;
}

/**
 * Builds a properly URL-encoded WhatsApp wa.me link with prefilled inquiry message
 */
export function buildWhatsAppLink(params: StandardInquiryParams): string {
  const cleanPhone = WHATSAPP_NUMBER.replace(/\D/g, "");

  const messageLines = [
    "Hello, I would like to inquire about your travel services.",
    "",
    `Service: ${params.service}`,
    `Name: ${params.name}`,
  ];

  if (params.from) messageLines.push(`From: ${params.from}`);
  if (params.to) messageLines.push(`To: ${params.to}`);
  if (params.travelDate) messageLines.push(`Travel Date: ${params.travelDate}`);
  if (params.passengers) messageLines.push(`Passengers / Guests: ${params.passengers}`);
  if (params.whatsappNumber) messageLines.push(`WhatsApp Number: ${params.whatsappNumber}`);
  if (params.additionalDetails) messageLines.push(`Details: ${params.additionalDetails}`);

  messageLines.push("", "Please contact me with available options and pricing.");

  const fullText = messageLines.join("\n");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(fullText)}`;
}

/**
 * Builds a direct general WhatsApp link with custom message
 */
export function buildCustomWhatsAppLink(customMessage: string, overrideNumber?: string): string {
  const targetNumber = overrideNumber || WHATSAPP_NUMBER;
  const cleanPhone = targetNumber.replace(/\D/g, "");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(customMessage)}`;
}
