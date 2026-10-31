// Builders for the acción principal and the acciones secundarias.
// Formats: Google Maps URLs (developers.google.com/maps/documentation/urls)
// and WhatsApp click to chat (wa.me).

export function comoLlegarUrl(destino: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destino)}`;
}

// wa.me wants the full international number as digits only: no "+", spaces or leading zeros.
export function whatsappUrl(numero: string): string {
  const digitos = numero.replace(/\D/g, "").replace(/^0+/, "");
  return `https://wa.me/${digitos}`;
}

export function instagramUrl(usuario: string): string {
  return `https://www.instagram.com/${usuario.replace(/^@/, "")}/`;
}
