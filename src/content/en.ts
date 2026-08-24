import type { Content } from "./types";

export const en: Content = {
  meta: {
    title: "David Biriș 1-on-1 · Personal Trainer Târgu Mureș",
    description:
      "Personal trainer in Târgu Mureș. One-on-one mentoring for weight loss, strength and habits that last: lifting, boxing, swimming or climbing, plus real nutrition.",
  },
  pageMeta: {
    metoda: {
      title: "The method · Personal trainer Târgu Mureș",
      description:
        "How the mentoring works: lifting as the base, your sport on top of it, and nutrition that lasts. Personal trainer in Târgu Mureș, in Romanian and English.",
    },
    rezultate: {
      title: "Real results · Personal trainer Târgu Mureș",
      description:
        "Two people who started from different places, and what changed. Before and after photos, in their own words. One-on-one mentoring in Târgu Mureș.",
    },
    despre: {
      title: "About David Biriș · Personal trainer Târgu Mureș",
      description:
        "7 years under the bar, second year of medical school. He has been through the hard start too. Personal trainer in Târgu Mureș for weight loss and strength.",
    },
  },
  business: {
    serviceType: "One-on-one fitness mentoring",
    areaServed: "Mureș County",
    audience: "Adults who want to lose weight, get stronger or learn how to train",
    locationLine: "One-on-one training in Târgu Mureș, in Romanian and English.",
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
    headline: "I won't teach you to train.",
    headlineAccent: "I'll teach you to want to.",
    subheadline:
      "One-on-one mentoring that combines the sport you already do, whether that is boxing, swimming, climbing or lifting, with a nutrition plan that doesn't ask you to give up your life.",
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
    headline: "It builds on what you already do.",
    body: "We're not asking you to drop your sport to make room for the gym. The gym becomes the structure that makes everything else better.",
    pillars: [
      { id: "sala", name: "Lifting", angle: "The base. The structure everything else sits on." },
      { id: "box", name: "Boxing", angle: "Conditioning, coordination, a clear head." },
      { id: "inot", name: "Swimming", angle: "Active recovery, lungs, joints that get a break." },
      { id: "catarat", name: "Climbing", angle: "Real strength, grip, control over your own body." },
      { id: "nutritie", name: "Nutrition", angle: "Food you'll still be eating in a year, not just while cutting." },
      { id: "consistenta", name: "Consistency", angle: "The only variable that matters long term." },
    ],
  },
  reel: {
    headline: "Five ways to move. All of them fit the plan.",
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
          "In Târgu Mureș. The plan is built around your schedule, not the other way round, so we set the hours once we know what your week looks like.",
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
