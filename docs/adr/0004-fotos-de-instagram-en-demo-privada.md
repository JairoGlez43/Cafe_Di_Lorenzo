# 0004. Fotos de Instagram y logo solo en una demo privada
Status: Accepted

## Context
La demo usa el logo y fotos del Instagram del café para que se vea ya personalizada.
El café todavía no ha dado permiso, y varias fotos llevan la marca de agua
"©Bnal_photographer", es decir, los derechos son del fotógrafo.

## Decision
Esos recursos se usan solo en una demo privada: `noindex`, URL que no se publica y que
se comparte solo con el café.

## Consequences
- Antes de publicar de verdad hay que conseguir el permiso del café y del fotógrafo, o
  las fotos originales sin marca de agua.
- El hosting de la demo tiene que poder abrirse desde una conexión cubana; hay que
  comprobarlo antes del pitch.
