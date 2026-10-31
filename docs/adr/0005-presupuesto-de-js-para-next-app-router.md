# 0005. Next.js App Router con un presupuesto de JS de 180 KB
Status: Accepted

## Context
La ADR 0001 elige Next.js y la 0002 limita el JS a 90 KB gzip. Un build mínimo con
`output: 'export'` (Next 16.4.3, React 19.3, App Router, una página con un `<h1>` y un
enlace) ya carga 170 KB gzip de JS (168 KB con webpack). Con Pages Router son 111 KB y
con Astro, 0 KB: ninguna variante de Next cabe en 90 KB. Lighthouse 12 móvil (red lenta
simulada, CPU ×4) sobre ese build mínimo da Rendimiento 97-99, LCP 2,0-2,1 s y TBT
90-180 ms.

## Decision
Se mantiene Next.js con App Router y el límite de JS sube a 180 KB gzip, medido como la
suma gzip de todos los scripts que carga el `index.html` exportado. El resto de la 0002
sigue igual: primera vista ≤ 300 KB, página completa ≤ 1,2 MB y LCP ≤ 3 s en Lighthouse
móvil con red lenta; animaciones solo con SVG + CSS (incluidas las ligadas al scroll),
nada de vídeo, Lottie ni 3D; una única animación protagonista y el resto
microinteracciones; con `prefers-reduced-motion`, todo queda estático.

## Consequences
- El framework se come ~170 de los 300 KB de la primera vista: quedan ~130 KB para HTML,
  CSS, fuente, logo y foto de la Portada.
- Al JS propio le quedan ~10 KB gzip. Los componentes son Server Components y solo
  llevan `'use client'` los que necesitan interacción (Menú, respaldo de la animación).
  GSAP no cabe (27,7 KB gzip el núcleo, más 17,6 KB ScrollTrigger).
- Subir de versión Next puede hacer crecer el runtime; el script de peso lo detecta y
  hace fallar el slice.
- Si el presupuesto no se sostiene, la alternativa ya medida es Astro (0 KB de base), con
  una ADR que sustituya a la 0001.
