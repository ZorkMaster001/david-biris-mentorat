"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { shouldRender3D, useDeviceCapabilities } from "@/lib/device";

// `three` nu are ce cauta in bundle-ul initial: fundalul se incarca dupa ce pagina
// e deja pe ecran si doar in browser.
const Silk = dynamic(() => import("@/components/bg/Silk"), { ssr: false });

/**
 * Un singur strat fix in spatele intregii pagini, nu cate un fundal pe sectiune:
 * clientul a respins deja benzile de culoare care se schimbau de la o sectiune la
 * alta. Sectiunile sunt transparente, deci matasea se vede peste tot unde nu e o
 * fotografie sau un card.
 *
 * Opacitatea e mica anume. Turcoazul `#94b8b7` la intensitate plina e mai deschis
 * decat textul, deci pagina ar fi devenit ilizibila; la 30% peste `--color-ink`
 * modelul urca pana pe la `#333f3f`, unde textul os pastreaza un contrast de
 * ~11:1, mult peste pragul AAA.
 */
/**
 * Latimea de la care fundalul animat merita. Sub ea, pe telefon, shader-ul pe tot
 * ecranul rula in acelasi timp cu scena ganterei — doua contexte WebGL, unul dintre
 * ele desenand fiecare pixel al ecranului la fiecare cadru. Gantera, care e chiar o
 * cerinta a clientului, pierdea intrecerea: se incarca greu sau se misca sacadat.
 * Pe telefon ramane degradeul static, in aceleasi culori; la 30% opacitate diferenta
 * dintre el si shader e oricum aproape invizibila.
 */
const MIN_WIDTH = 1024;

export function SilkBackground() {
  const capabilities = useDeviceCapabilities();
  const [wideEnough, setWideEnough] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(`(min-width: ${MIN_WIDTH}px)`);
    const sync = () => setWideEnough(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Se vede cand WebGL lipseste, la reduced motion, pe save-data, pe telefoane
          slabe si pe orice ecran ingust. Aceleasi culori, doar ca nu se misca. */}
      <div className="silk-fallback absolute inset-0" />
      {wideEnough && shouldRender3D(capabilities) ? (
        <div className="absolute inset-0 opacity-30">
          <Silk speed={5} scale={1} color="#94b8b7" noiseIntensity={1.5} rotation={0} />
        </div>
      ) : null}
    </div>
  );
}
