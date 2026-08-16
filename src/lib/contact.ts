export const PHONE_E164 = "40755659389";
export const PHONE_DISPLAY = "+40 755 659 389";

/**
 * TODO(client): handle-ul de Instagram nu a fost furnizat inca.
 * Trebuie inlocuit inainte de publicare — apare si in JSON-LD (sameAs).
 */
export const INSTAGRAM_HANDLE = "davidbiris";

export function whatsappUrl(message: string): string {
  const base = `https://wa.me/${PHONE_E164}`;
  if (message.length === 0) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function instagramUrl(): string {
  return `https://instagram.com/${INSTAGRAM_HANDLE}`;
}
