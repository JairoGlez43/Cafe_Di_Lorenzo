# 0003. Tema único, sin selector claro/oscuro
Status: Accepted

## Context
El modo claro/oscuro aporta sobre todo en herramientas de uso prolongado. Una landing de
café se visita un minuto y vive de su identidad. La marca ya tiene dos registros: jardín
de día y velas de noche, con el logo en verde botella y dorado.

## Decision
Un solo tema, con dirección de arte propia: secciones en tono crema y en tono verde
botella, alternadas, con acento dorado. No hay selector de tema. Los colores se definen
en variables CSS.

## Consequences
- Cada foto, trazo y animación se ajusta a un solo diseño: la mitad de revisión visual.
- No respeta la preferencia de modo oscuro del sistema del visitante.
- Añadir un modo oscuro más adelante solo requiere redefinir las variables.
