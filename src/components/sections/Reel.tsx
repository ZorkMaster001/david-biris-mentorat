import { ClipMarquee } from "@/components/reel/ClipMarquee";
import { Reveal } from "@/components/ui/Reveal";
import type { Content } from "@/content/types";

/**
 * Sectiune cu latime completa: banda trebuie sa iasa dincolo de coloana de text,
 * deci nu foloseste `Section`, care isi limiteaza copiii la 1200px.
 */
export function Reel({ data }: { data: Content["reel"] }) {
  return (
    <section id="miscare" className="py-20 sm:py-28">
      <div className="mx-auto w-full max-w-[1200px] px-5">
        <Reveal>
          <h2 className="font-display text-[clamp(2rem,7vw,4.5rem)] max-w-[18ch]">{data.headline}</h2>
        </Reveal>
      </div>

      <div className="mt-12">
        <ClipMarquee clips={data.clips} pauseLabel={data.pauseLabel} resumeLabel={data.resumeLabel} />
      </div>
    </section>
  );
}
