import { cafe, portada } from "@/content";
import { ruta, srcSet, variantes } from "@/lib/imagenes";
import { comoLlegarUrl, instagramUrl, whatsappUrl } from "@/lib/links";

const foco = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-crema";
const anchoFoto = variantes.portada.anchos.at(-1)!;

export function Portada() {
  return (
    <section aria-labelledby="portada-titulo" className="bg-verde text-crema">
      <div className="mx-auto grid max-w-5xl items-center gap-10 px-6 pt-10 pb-16 md:grid-cols-2 md:py-24">
        <div className="flex flex-col items-center gap-7 text-center md:items-start md:text-left">
          <h1 id="portada-titulo">
            <picture>
              <source type="image/avif" srcSet={srcSet("logo", "avif")} sizes="72px" />
              <img
                src={ruta("logo", 72, "webp")}
                srcSet={srcSet("logo", "webp")}
                sizes="72px"
                width={72}
                height={72}
                alt={cafe.logo.alt}
              />
            </picture>
          </h1>
          <p className="max-w-[16ch] font-titulo text-frase font-semibold text-balance">
            {portada.frase}
          </p>
          {/* Acción principal: name first so Maps can match the place, not only the street. */}
          <a
            href={comoLlegarUrl(`${cafe.nombre}, ${cafe.direccion}`)}
            className={`rounded-full bg-dorado px-8 py-3 text-lg font-semibold text-verde ${foco}`}
          >
            {portada.acciones.comoLlegar}
          </a>
          <ul className="flex gap-8 text-base">
            <li>
              <a href={whatsappUrl(cafe.whatsapp)} className={`underline underline-offset-4 ${foco}`}>
                {portada.acciones.whatsapp}
              </a>
            </li>
            <li>
              <a href={instagramUrl(cafe.instagram)} className={`underline underline-offset-4 ${foco}`}>
                {portada.acciones.instagram}
              </a>
            </li>
          </ul>
        </div>
        {/* Likely LCP on mobile: loaded eagerly with high priority. */}
        <picture className="mx-auto block w-[min(80vw,420px)] overflow-hidden rounded-t-full">
          <source
            type="image/avif"
            srcSet={srcSet("portada", "avif")}
            sizes="(min-width: 768px) 420px, 80vw"
          />
          <img
            src={ruta("portada", 480, "webp")}
            srcSet={srcSet("portada", "webp")}
            sizes="(min-width: 768px) 420px, 80vw"
            width={anchoFoto}
            height={Math.round(anchoFoto * variantes.portada.proporcion)}
            alt={portada.foto.alt}
            fetchPriority="high"
            className="h-auto w-full"
          />
        </picture>
      </div>
    </section>
  );
}
