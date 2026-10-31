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
  // Originals from Instagram, private demo only (ADR 0004). Converted by scripts/images.ts.
  logo: { origen: "references/img-1_files/DiLorenzo_Logo.jpg", alt: "Café Di Lorenzo" },
};

export const portada = {
  frase: "De día, jardín. De noche, velas.", // provisional
  foto: {
    origen: "references/img-1_files/539809084_17941597299029391_6602350509553311694_n.jpg",
    alt: "Mesa del café con velas encendidas, flores blancas y una tetera de porcelana",
  },
  acciones: {
    comoLlegar: "Cómo llegar",
    whatsapp: "WhatsApp",
    instagram: "Instagram",
  },
};
