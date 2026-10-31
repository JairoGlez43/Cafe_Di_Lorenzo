# 0001. Exportación estática y contenido en un único módulo
Status: Accepted

## Context
La demo se verá sobre todo desde móviles en Cuba, con datos 3G. Tiene que poder
alojarse en cualquier sitio (también en un hosting cubano si el café lo pide) y
enseñarse incluso sin conexión. Aun así, el contenido (productos, horario) tiene que
poder cambiar más adelante.

## Decision
Next.js con `output: 'export'`: solo HTML, CSS, JS e imágenes, sin servidor ni base de
datos. Todo el contenido editable vive en un único módulo de contenido tipado, y los
componentes solo leen de él. Para cambiar contenido se edita ese módulo y se reconstruye.

## Consequences
- Cero tiempo de servidor; hosting gratuito y portable.
- El optimizador de `next/image` no funciona: las imágenes se convierten en el build (sharp).
- Si el café acepta, la forma de editar (CMS sobre git, Google Sheet en el build o
  servidor con ISR) se decide entonces sin tocar los componentes. Pedidos o reservas
  obligarían a abandonar la exportación estática.
