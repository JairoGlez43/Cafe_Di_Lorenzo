// Módulo de contenido: the only place for editable content.
// Components read from here; nothing user-facing is hardcoded elsewhere.
// Values marked provisional come from the café's Instagram until the café confirms them.

export const sitio = {
  titulo: "Café Di Lorenzo · La Habana",
  descripcion: "Café, brunch y jardín en Miramar, La Habana.",
};

// Provisional: taken from Instagram.
export const cafe = {
  nombre: "Café Di Lorenzo",
  direccion: "Calle 20 e/ 31A y 33, Miramar, Playa, La Habana, Cuba",
  whatsapp: "+53 50539476",
  instagram: "cafe_dilorenzo_habana",
  horario: "Todos los días · 8:00 a 23:00", // provisional; Visítanos reuses it
  // Originals from Instagram, private demo only (spec 0004). Converted by scripts/images.ts.
  logo: { origen: "references/img-1_files/DiLorenzo_Logo.jpg", alt: "Café Di Lorenzo" },
};

// Bar anchors, one per section that exists (spec 0008 AC-8). Each section adds its own.
export const navegacion: { id: string; etiqueta: string }[] = [];

export const portada = {
  etiqueta: "Miramar · La Habana",
  frase: "De día, jardín. De noche, velas.", // provisional
  foto: {
    origen: "references/img-1_files/583783959_17950113657029391_3103025115156968219_n.jpg",
    alt: "Batidos y limonadas con pajitas doradas sobre una mesa del jardín",
  },
  acciones: {
    comoLlegar: "Cómo llegar",
    whatsapp: "WhatsApp",
    instagram: "Instagram",
  },
};
