# 0002. Presupuesto de peso y animaciones solo con SVG + CSS
Status: Superseded by 0005

## Context
El cliente pide una landing "fancy", con animaciones, pero que vaya bien con 3G en Cuba.
Algunas fotos de IG pesan hasta 3 MB, así que una sola sin optimizar ya rompe la experiencia.

## Decision
Primera vista ≤ 300 KB, página completa ≤ 1,2 MB, JS ≤ 90 KB gzip y LCP ≤ 3 s en
Lighthouse móvil con red lenta. Las animaciones se hacen con SVG + CSS (incluidas las
animaciones ligadas al scroll); nada de vídeo, Lottie ni 3D. GSAP solo si una animación
concreta lo justifica y cabe en el presupuesto. Hay una única animación protagonista;
el resto son microinteracciones. Con `prefers-reduced-motion`, todo queda estático.

## Consequences
- El script de peso hace fallar el slice si se pasa de algún límite.
- Las ideas que dependen de vídeo o ilustración pesada quedan descartadas.
- El diseño de movimiento lo decide Claude y se revisa en cada slice.
