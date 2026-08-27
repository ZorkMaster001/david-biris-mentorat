"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { META_PIXEL_ID, leadChannel, type LeadChannel } from "@/lib/analytics";

/**
 * Fragmentul standard Meta Pixel, incarcat prin `next/script`.
 *
 * Se monteaza **doar dupa acordul explicit** — vezi `Analytics.tsx`. Cat timp
 * componenta asta nu e in pagina, nu exista nici `fbevents.js`, nici cookie-ul
 * `_fbp`, nici vreun apel catre Meta.
 *
 * `afterInteractive` (implicit) il tine dupa hidratare: masurarea nu are voie sa
 * concureze cu randarea primei pagini. `beforeInteractive` ar bloca fetch-ul
 * codului nostru pentru un script de urmarire, iar `lazyOnload` ar rata vizitele
 * scurte — cele care pleaca inainte ca browserul sa fie liber.
 *
 * Fragmentul inline are obligatoriu `id`, altfel Next nu il poate urmari. Vezi
 * `node_modules/next/dist/docs/01-app/02-guides/scripts.md`.
 */
export function MetaPixel() {
  const pathname = usePathname();
  // Ruta pentru care s-a trimis deja o vizualizare. Pornita chiar de la ruta curenta:
  // pentru ea, `PageView`-ul pleaca din fragmentul de mai jos.
  const trackedPath = useRef(pathname);
  const sentLeads = useRef(new Set<LeadChannel>());

  /*
    Navigarea intre pagini se face pe client (Link din App Router), deci browserul
    nu mai incarca nimic si fragmentul de mai jos ruleaza o singura data, la prima
    pagina. Fara efectul asta, Meta ar vedea o singura vizualizare per sesiune si
    /ro/metoda ori /ro/rezultate n-ar exista niciodata in date.

    Conditia e „alta ruta decat cea raportata", nu „nu e prima rulare". Diferenta se
    vede in dev: sub `reactStrictMode` React monteaza componenta, curata si monteaza
    din nou, cu aceleasi ref-uri. Un simplu „sari prima rulare" era deja consumat la
    a doua montare si trimitea o vizualizare fantoma — masurat, trei `PageView` la
    doua pagini. Comparat pe ruta, remontarea nu mai schimba nimic.
  */
  useEffect(() => {
    if (trackedPath.current === pathname) return;
    trackedPath.current = pathname;
    window.fbq?.("track", "PageView");
  }, [pathname]);

  /*
    `Lead` — singura conversie reala de pe site: omul a dat clic ca sa scrie.
    Nu exista formular, deci daca nu se masoara clicul asta, campaniile Meta n-au
    pe ce sa optimizeze si raman la „a vazut pagina".

    Un singur ascultator pe `document`, nu `onClick` pe fiecare buton: legaturile
    de contact apar in patru componente, iar subsolul e server component — vezi
    comentariul de la `leadChannel` din `lib/analytics.ts`.

    Butonul mare de contact e sarit dinadins. El poarta pe `href` adresa de
    WhatsApp, dar clicul deschide fereastra de alegere in loc sa plece acolo
    (`aria-haspopup="dialog"`, cu `preventDefault`). Numarat acolo, `Lead` ar fi
    insemnat „a deschis o fereastra", nu „a plecat sa scrie" — evenimentul pleaca
    de pe canalul ales dinauntru.

    Fiecare canal se trimite o singura data per incarcare de pagina: doua clicuri
    pe acelasi buton sunt un singur om care s-a razgandit ca deschide, nu doua
    conversii.
  */
  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.getAttribute("aria-haspopup") === "dialog") return;

      const channel = leadChannel(anchor.href);
      if (channel === null || sentLeads.current.has(channel)) return;
      sentLeads.current.add(channel);
      window.fbq?.("track", "Lead", { content_name: channel, content_category: "contact" });
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <>
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', ${JSON.stringify(META_PIXEL_ID)});
fbq('track', 'PageView');`,
        }}
      />
      {/*
        Varianta fara JavaScript, ceruta de fragmentul oficial: un pixel-imagine
        care raporteaza aceeasi vizualizare. Are sens doar aici, sub acord: fara
        JavaScript n-ar fi existat niciodata un banner prin care sa fie dat.
      */}
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element -- pixel de 1x1, nu imagine de continut */}
        <img
          height="1"
          width="1"
          alt=""
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
