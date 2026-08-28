export function normalizePhoneNumber(phone: string): string {
  // Remove all non-numeric characters
  const numericOnly = phone.replace(/\D/g, "");
  // If it starts with 0 and is likely an Indian number, replace with 91
  if (numericOnly.startsWith("0") && numericOnly.length === 11) {
    return "91" + numericOnly.substring(1);
  }
  // If it's a 10 digit number (standard Indian without code), prepend 91
  if (numericOnly.length === 10) {
    return "91" + numericOnly;
  }
  // Otherwise just return the numeric version (assuming it includes country code like 91...)
  return numericOnly;
}

export function buildWhatsAppUrl(ownerPhone: string, message: string): string {
  const normalizedNumber = normalizePhoneNumber(ownerPhone);
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${normalizedNumber}?text=${encodedMessage}`;
}
