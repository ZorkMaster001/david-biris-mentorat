import { notFound } from "next/navigation";
import { Hero } from "@/components/hero/Hero";
import { Footer } from "@/components/nav/Footer";
import { Balance } from "@/components/sections/Balance";
import { David } from "@/components/sections/David";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { FirstTime } from "@/components/sections/FirstTime";
import { Method } from "@/components/sections/Method";
import { Offer } from "@/components/sections/Offer";
import { Pricing } from "@/components/sections/Pricing";
import { Process } from "@/components/sections/Process";
import { Reel } from "@/components/sections/Reel";
import { Results } from "@/components/sections/Results";
import { JsonLd } from "@/components/seo/JsonLd";
import { getContent } from "@/content";
import { isLocale } from "@/content/types";
import { webPageSchema } from "@/lib/seo";
import { localePath } from "@/lib/site";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = getContent(locale);

  return (
    <main>
      <Hero
        headline={content.hero.headline}
        headlineAccent={content.hero.headlineAccent}
        subheadline={content.hero.subheadline}
        ctaPrimary={content.hero.ctaPrimary}
        contact={content.contact}
        ctaSecondary={content.hero.ctaSecondary}
        ctaSecondaryHref={localePath(locale, "metoda")}
        image={content.hero.image}
        imageAlt={content.hero.imageAlt}
      />
      {/*
        Ordinea sectiunilor e argumentul paginii, nu o insiruire de blocuri:
        promisiune (hero) → ce cumperi, concret (`Offer`) → dovada ca a functionat
        la altii (`Results`) → de ce ti-ai dori-o (`FirstTime`) → ca se poate fara
        sa-ti ocupe viata (`Reel`) → abia apoi cum se face (`Method`).

        `Results` a urcat inaintea tuturor explicatiilor anume: traficul vine din
        TikTok, iar omul care nu il cunoaste pe David are nevoie sa vada rezultate
        inainte sa aiba rabdare de metoda.

        `Pricing` vine abia dupa `Process`, spre finalul argumentului: pretul se
        citeste altfel cand omul stie deja ce primeste, a vazut dovada si a inteles
        cum incepe. Pus mai sus, ar fi fost o suma comparata cu nimic. Iar `Faq` sta
        intre pret si `FinalCta` anume — obiectiile care apar dupa ce vezi suma se
        raspund inainte de ultimul buton.
      */}
      <Offer data={content.offer} />
      <Results data={content.results} />
      <FirstTime data={content.firstTime} />
      <Reel data={content.reel} />
      <Method data={content.method} />
      <Balance data={content.balance} />
      <David data={content.david} />
      <Process data={content.process} />
      <Pricing data={content.pricing} contact={content.contact} />
      <Faq data={content.faq} />
      <FinalCta data={content.finalCta} contact={content.contact} />
      <Footer data={content.footer} contact={content.contact} business={content.business} />

      {/*
        Pagina de start e in acelasi timp pagina si colectie de intrebari, deci
        poarta amandoua tipurile pe un singur nod. Doua noduri separate — un
        `WebPage` si un `FAQPage` la aceeasi adresa — ar fi insemnat doua pagini
        care se dau drept aceeasi, exact genul de ambiguitate care face un motor
        sa nu ia in seama niciuna.

        Intrebarile sunt cel mai citabil lucru de pe site: raspunsuri scurte, la
        obiect, formulate exact cum le pune omul. Aici sunt date gata extrase, ca
        un asistent sa nu fie nevoit sa citeasca pagina randata ca sa le gaseasca.
      */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          ...webPageSchema({ locale, route: "", meta: content.meta }),
          "@type": ["WebPage", "FAQPage"],
          mainEntity: content.faq.items.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }}
      />
    </main>
  );
}
