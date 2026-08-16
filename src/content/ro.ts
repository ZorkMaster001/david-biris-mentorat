import type { Content } from "./types";

export const ro: Content = {
  meta: {
    title: "David Biriș · Mentorat 1-la-1",
    description:
      "Mentorat 1-la-1 care îmbină sportul pe care îl faci deja — sală, box, înot, cățărat — cu un plan de nutriție care nu îți cere să renunți la viața ta.",
  },
  nav: [
    { href: "", label: "Acasă" },
    { href: "metoda", label: "Metoda" },
    { href: "rezultate", label: "Rezultate" },
    { href: "despre", label: "Despre" },
  ],
  contact: {
    fabLabel: "Contact",
    whatsappLabel: "WhatsApp",
    instagramLabel: "Instagram",
    prefilledMessage: "Salut David, am văzut site-ul și vreau să aflu mai multe despre mentorat.",
  },
  hero: {
    headline: "Nu te învăț să faci sală. Te învăț să îți placă.",
    subheadline:
      "Mentorat 1-la-1 care îmbină sportul pe care îl faci deja — box, înot, cățărat, sală — cu un plan de nutriție care nu îți cere să renunți la viața ta.",
    ctaPrimary: "Scrie-i lui David pe WhatsApp",
    ctaSecondary: "Vezi metoda",
    slides: [
      { id: "sala", word: "Ridică", video: "01-sala", poster: "poster-01-sala", alt: "David antrenându-se în sală" },
      { id: "box", word: "Lovește", video: "02-box", poster: "poster-02-box", alt: "Antrenament de box în doi" },
      { id: "catarat", word: "Cațără", video: "03-catarat", poster: "poster-03-catarat", alt: "Cățărare pe stâncă, cu coardă și cască" },
      { id: "apa", word: "Sari", video: "04-apa", poster: "poster-04-apa", alt: "Săritură de pe stâncă în mare" },
      { id: "alergare", word: "Aleargă", video: "05-alergare", poster: "poster-05-alergare", alt: "Alergare pe plajă în zori" },
    ],
  },
  firstTime: {
    eyebrow: "Pentru prima dată",
    headline: "Cineva te învață cum să începi să îți placă sala — nu cum să o suporți.",
    body: [
      "Majoritatea programelor îți dau exerciții și te lasă să te descurci cu partea grea, care e să te întorci săptămâna viitoare.",
      "Aici lucrăm invers. Construim întâi obiceiul și motivul, apoi încărcăm greutatea.",
      "Ținta nu e să reziști opt săptămâni. E ca peste doi ani să ți se pară ciudat să nu te antrenezi.",
    ],
    image: "training-bench",
    imageAlt: "David în sală, între serii",
  },
  balance: {
    headline: "Nu trebuie să lași totul în urmă ca să îți schimbi fizicul.",
    beerCaption: "Berea de pe plajă nu îți anulează luna. Bere în fiecare seară, da.",
    fastfoodCaption: "Nici burgerul din aeroport. Ce contează e ce faci în restul săptămânii.",
    closing:
      "Ai nevoie de o balanță, nu de o pedeapsă. Planurile care interzic tot funcționează trei săptămâni și apoi te lasă mai rău decât te-au găsit. Un plan bun are loc în el pentru viața pe care o trăiești deja.",
  },
  method: {
    eyebrow: "Metoda",
    headline: "Se construiește peste ce faci deja.",
    body: "Nu îți cerem să renunți la sportul tău ca să faci sală. Sala devine structura care le face pe toate celelalte mai bune.",
    pillars: [
      { id: "sala", name: "Sală", angle: "Baza. Structura peste care se așază tot restul." },
      { id: "box", name: "Box", angle: "Condiție, coordonare, capul limpede." },
      { id: "inot", name: "Înot", angle: "Recuperare activă, plămâni, articulații odihnite." },
      { id: "catarat", name: "Cățărat", angle: "Forță reală, priză, control al corpului." },
      { id: "nutritie", name: "Nutriție", angle: "Mâncare pe care o mănânci și peste un an, nu doar în deficit." },
      { id: "consistenta", name: "Consistență", angle: "Singura variabilă care contează pe termen lung." },
    ],
  },
  david: {
    eyebrow: "Cine te învață",
    headline: "7 ani în sală. Anul 2 la Medicină.",
    body: [
      "A intrat în sală la 13 ani și nu s-a mai oprit.",
      "Studiază Medicina, deci înțelege ce se întâmplă în corp când ridici greutatea, nu doar câte repetări să faci.",
      "Antrenează oameni pentru că a fost și el la început și știe exact unde se rupe firul.",
    ],
    image: "david-formal",
    imageAlt: "David Biriș",
  },
  results: {
    eyebrow: "Rezultate",
    headline: "Doi oameni, două puncte de plecare diferite.",
    beforeLabel: "Înainte",
    afterLabel: "După",
    testimonials: [
      {
        id: "darius",
        name: "Darius B.",
        quote:
          "Cu ajutorul lui David nu doar că mi-am schimbat corpul. Sala a devenit un hobby adevărat — și, mai important, ideea de a te îmbunătăți puțin în fiecare zi.",
        note: null,
        beforeSrc: "darius-before",
        afterSrc: "darius-after",
        beforeAlt: "Darius înainte de mentorat",
        afterAlt: "Darius după mentorat",
      },
      {
        id: "meril",
        name: "Meril",
        quote:
          "Am venit din Elveția ca să studiez Medicina și nu vorbesc română. Cu David ne-am înțeles perfect de la început și am făcut un progres mare în scurt timp.",
        note: "Mentoratul funcționează și în engleză.",
        beforeSrc: "meril-before",
        afterSrc: "meril-after",
        beforeAlt: "Meril înainte de mentorat",
        afterAlt: "Meril după mentorat",
      },
    ],
  },
  process: {
    eyebrow: "Cum decurge",
    headline: "Trei pași, fără formulare.",
    steps: [
      { index: "01", title: "Scrii", body: "Un mesaj pe WhatsApp sau Instagram. Prima discuție e gratuită." },
      { index: "02", title: "Construim planul", body: "Pornind de la ce sport faci, cât timp ai și ce mănânci acum." },
      { index: "03", title: "Ajustăm", body: "Săptămână de săptămână, cu acces direct la David." },
    ],
  },
  faq: {
    eyebrow: "Întrebări",
    headline: "Ce te oprește, de fapt.",
    items: [
      { question: "N-am timp, am facultate.", answer: "Și David are. Planul se construiește în jurul orarului tău, nu invers." },
      { question: "N-am mai fost niciodată în sală.", answer: "E cazul cel mai bun. N-ai obiceiuri proaste de dezvățat." },
      {
        question: "Trebuie să renunț la ieșiri și la bere?",
        answer:
          "Nu. Un plan care interzice tot ține trei săptămâni. Construim unul în care încap și ieșirile, pentru că altfel nu îl ții.",
      },
      { question: "Nu vorbesc română.", answer: "Meril nu vorbește nici el. Mentoratul merge în engleză." },
    ],
  },
  finalCta: {
    headline: "Prima discuție e gratuită.",
    body: "Scrii, vorbim, îți spun sincer dacă te pot ajuta. Dacă nu simți că e pentru tine, nu se întâmplă nimic.",
    cta: "Scrie-i lui David pe WhatsApp",
  },
  footer: {
    disclaimer:
      "David Biriș este student la Medicină, nu medic sau nutriționist licențiat. Mentoratul nu înlocuiește sfatul medical. Dacă ai o afecțiune, vorbește întâi cu medicul tău.",
    languageLabel: "Limbă",
    rights: "David Biriș",
  },
};
