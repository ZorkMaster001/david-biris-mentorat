import type { Content } from "./types";

export const en: Content = {
  meta: {
    title: "David Biriș 1-on-1 · Personal Trainer Târgu Mureș",
    description:
      "Personal trainer in Târgu Mureș and online. One-on-one mentoring for weight loss, strength and habits that last: training, nutrition, motivation and discipline, built around your life.",
  },
  pageMeta: {
    metoda: {
      title: "The method · Personal trainer Târgu Mureș",
      description:
        "Training, nutrition, programming, motivation and discipline, arranged around the life you already have. Personal trainer in Târgu Mureș and online, in Romanian and English.",
    },
    rezultate: {
      title: "Real results · Personal trainer Târgu Mureș",
      description:
        "Two people who started from different places, and what changed. Before and after photos, in their own words. One-on-one mentoring in Târgu Mureș and online.",
    },
    despre: {
      title: "About David Biriș · Personal trainer Târgu Mureș",
      description:
        "7 years under the bar, second year of medical school. He has been through the hard start too. Personal trainer in Târgu Mureș and online, for weight loss and strength.",
    },
  },
  business: {
    serviceType: "One-on-one fitness mentoring",
    areaServed: "Mureș County",
    audience: "Adults who want to lose weight, get stronger or learn how to train",
    locationLine: "One-on-one mentoring in Târgu Mureș and online, in Romanian and English.",
  },
  nav: [
    { href: "", label: "Home" },
    { href: "metoda", label: "Method" },
    { href: "rezultate", label: "Results" },
    { href: "despre", label: "About" },
  ],
  backLabel: "Back",
  contact: {
    fabLabel: "Contact",
    whatsappLabel: "WhatsApp",
    instagramLabel: "Instagram",
    prefilledMessage: "Hi David, I saw your site and I'd like to know more about the mentoring.",
    pickerTitle: "Whichever is easier for you.",
    pickerBody: "It goes straight to David. No forms, no middleman.",
    whatsappNote: "The message is already written. Fastest reply here.",
    instagramNote: "If you'd rather see what he posts first.",
    closeLabel: "Close",
  },
  hero: {
    headline: "You don't give up what you love",
    headlineAccent: "to look good.",
    subheadline:
      "One-on-one mentoring that fits the gym around your everyday life and the hobbies you already have. Training, nutrition, motivation and discipline, in Târgu Mureș or online.",
    ctaPrimary: "Message David",
    ctaSecondary: "See the method",
    image: "hiking-peaks",
    imageAlt: "David on the cliff edge, the valley and the mountains behind him",
  },
  firstTime: {
    headline: "Someone teaches you how to start enjoying the gym, not how to endure it.",
    body: [
      "Most programmes hand you exercises and leave you alone with the hard part, which is coming back next week.",
      "Here we work the other way round. We build the habit and the reason first, then we add the weight.",
      "The goal isn't to survive eight weeks. It's that in two years, not training feels strange.",
    ],
    image: "training-bench",
    imageAlt: "David in the gym, between sets",
  },
  balance: {
    headline: "You don't have to give everything up to change your body.",
    beerCaption: "A beer on the beach doesn't undo your month. A beer every night does.",
    fastfoodCaption: "Neither does the airport burger. What counts is the rest of the week.",
    closing:
      "You need balance, not punishment. Plans that ban everything work for three weeks and then leave you worse off than they found you. A good plan has room in it for the life you already live.",
  },
  method: {
    headline: "It is built around your life.",
    body: "It does not matter what sport you play or what your hobbies are. The gym sits on top of them, not in their place, and the rest is food, rhythm and reasons to come back.",
    pillars: [
      { id: "sala", name: "Lifting", angle: "The base. The structure everything else sits on." },
      { id: "antrenament", name: "Programming", angle: "A plan built on your week, not on someone else's." },
      { id: "nutritie", name: "Nutrition", angle: "Food you'll still be eating in a year, not just while cutting." },
      { id: "motivatie", name: "Motivation", angle: "The reason you come back next week too." },
      { id: "disciplina", name: "Discipline", angle: "What gets you in on the days you don't feel like it." },
      { id: "consistenta", name: "Consistency", angle: "The only variable that matters long term." },
    ],
    gallery: [
      { id: "catarat", src: "climbing-wall", alt: "David climbing a wall on rope" },
      { id: "nutritie", src: "nutrition-plate", alt: "A plate of simply cooked food" },
      { id: "creasta", src: "outdoor-summit", alt: "David on a ridge after the climb" },
    ],
  },
  reel: {
    headline: "That's him in every clip.",
    body: "He doesn't teach you boxing, swimming or climbing. But he does them, so he knows what each one asks of a body, and he builds the gym around them instead of against them.",
    pauseLabel: "Stop the reel",
    resumeLabel: "Start the reel",
    clips: [
      { id: "sala", video: "01-sala", poster: "poster-01-sala", alt: "David training in the gym" },
      { id: "box", video: "02-box", poster: "poster-02-box", alt: "Boxing session for two" },
      { id: "catarat", video: "03-catarat", poster: "poster-03-catarat", alt: "Rock climbing with rope and helmet" },
      { id: "apa", video: "04-apa", poster: "poster-04-apa", alt: "Cliff jump into the sea" },
      { id: "alergare", video: "05-alergare", poster: "poster-05-alergare", alt: "Running on the beach at dawn" },
    ],
  },
  david: {
    headline: "7 years under the bar. Second year of medical school.",
    body: [
      "He walked into a gym at 13 and never stopped.",
      "He studies medicine, so he understands what happens inside the body when you lift, not just how many reps to do.",
      "He coaches people because he started where you are and knows exactly where it falls apart.",
    ],
    image: "david-formal",
    imageAlt: "David Biriș",
    transformation: {
      headline: "He has been there too.",
      beforeSrc: "sea-rest",
      afterSrc: "outdoor-summit",
      beforeAlt: "David on the rocks by the sea, before the years of training",
      afterAlt: "David on a ridge, after years of training",
    },
  },
  results: {
    headline: "Two people, two different starting points.",
    beforeLabel: "Before",
    afterLabel: "After",
    quoteOpen: "“",
    quoteClose: "”",
    testimonials: [
      {
        id: "darius",
        name: "Darius B.",
        quote:
          "With David's help I didn't just change my body. The gym turned into a real hobby. And, more than that, so did the idea of getting a little better every day.",
        note: null,
        beforeSrc: "darius-before",
        afterSrc: "darius-after",
        beforeAlt: "Darius before the mentoring",
        afterAlt: "Darius after the mentoring",
      },
      {
        id: "meril",
        name: "Meril",
        quote:
          "I came from Switzerland to study medicine and I don't speak Romanian. David and I understood each other perfectly from the start, and I made a lot of progress in a short time.",
        note: "The mentoring works in English too.",
        beforeSrc: "meril-before",
        afterSrc: "meril-after",
        beforeAlt: "Meril before the mentoring",
        afterAlt: "Meril after the mentoring",
      },
    ],
  },
  process: {
    headline: "Three steps, no forms.",
    steps: [
      { index: "01", title: "You write", body: "A message on WhatsApp or Instagram. The first conversation is free." },
      { index: "02", title: "We build the plan", body: "Starting from the sport you do, the time you have and what you eat now." },
      { index: "03", title: "We adjust", body: "Week by week, with direct access to David." },
    ],
  },
  faq: {
    headline: "What's actually stopping you.",
    items: [
      { question: "I don't have time, I'm at university.", answer: "So is David. The plan is built around your schedule, not the other way round." },
      { question: "I've never set foot in a gym.", answer: "That's the best case. You have no bad habits to unlearn." },
      {
        question: "Do I have to give up going out and drinking?",
        answer:
          "No. A plan that bans everything lasts three weeks. We build one that has room for going out, because otherwise you won't stick to it.",
      },
      { question: "I don't speak Romanian.", answer: "Neither does Meril. The mentoring runs in English." },
      {
        question: "Where do the sessions take place?",
        answer:
          "In Târgu Mureș, face to face, or online from wherever you are. The plan, the food and the weekly adjustments work the same either way.",
      },
      {
        question: "I already play another sport. Is this still for me?",
        answer:
          "It is, and that is exactly the case the mentoring is built for. He doesn't teach you your sport — he builds the gym and the food around it, so the two stop working against each other.",
      },
      {
        question: "I only want to lose weight, not compete.",
        answer:
          "That is the most common case. Weight loss comes from what you eat during the rest of the week and from still walking into the gym next month, not from today's session. That is why the plan starts from the food you already eat.",
      },
    ],
  },
  finalCta: {
    headline: "The first conversation is free.",
    body: "You write, we talk, and I'll tell you honestly whether I can help. If it doesn't feel right for you, nothing happens.",
    cta: "Message David",
  },
  footer: {
    disclaimer:
      "David Biriș is a medical student, not a doctor or a licensed nutritionist. This mentoring does not replace medical advice. If you have a health condition, talk to your doctor first.",
    languageLabel: "Language",
    rights: "David Biriș",
    contactLabel: "Message him directly",
    wordmark: "David Biriș",
  },
};
