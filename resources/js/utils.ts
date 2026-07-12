/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Formats a number into Indonesian Rupiah (IDR) currency format.
 */
export function formatIDR(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Truncates text to a specified maximum length and appends "..." if exceeded.
 */
export function truncateText(text: string, limit: number): string {
  if (text.length <= limit) return text;
  return text.substring(0, limit).trim() + "...";
}

/**
 * Generates a dynamic WhatsApp link for direct customer-to-merchant communications.
 */
export function getWhatsAppLink(phone: string, message: string): string {
  // Normalize phone number (ensure no plus signs, spaces, or leading zeros if possible)
  let cleanPhone = phone.replace(/[^0-9]/g, "");
  if (cleanPhone.startsWith("0")) {
    cleanPhone = "62" + cleanPhone.substring(1);
  }
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
