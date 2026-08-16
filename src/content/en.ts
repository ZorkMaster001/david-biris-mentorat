import type { Content } from "./types";

export const en: Content = {
  meta: {
    title: "David Biriș · 1-on-1 Mentoring",
    description:
      "One-on-one mentoring that combines the sport you already do — lifting, boxing, swimming, climbing — with a nutrition plan that doesn't ask you to give up your life.",
  },
  nav: [
    { href: "", label: "Home" },
    { href: "metoda", label: "Method" },
    { href: "rezultate", label: "Results" },
    { href: "despre", label: "About" },
  ],
  contact: {
    fabLabel: "Contact",
    whatsappLabel: "WhatsApp",
    instagramLabel: "Instagram",
    prefilledMessage: "Hi David, I saw your site and I'd like to know more about the mentoring.",
  },
  hero: {
    headline: "I won't teach you to train. I'll teach you to want to.",
    subheadline:
      "One-on-one mentoring that combines the sport you already do — boxing, swimming, climbing, lifting — with a nutrition plan that doesn't ask you to give up your life.",
    ctaPrimary: "Message David on WhatsApp",
    ctaSecondary: "See the method",
    prevSlideLabel: "Previous slide",
    nextSlideLabel: "Next slide",
    pauseLabel: "Pause the slideshow",
    resumeLabel: "Resume the slideshow",
    slides: [
      { id: "sala", word: "Lift", video: "01-sala", poster: "poster-01-sala", alt: "David training in the gym" },
      { id: "box", word: "Strike", video: "02-box", poster: "poster-02-box", alt: "Boxing session for two" },
      { id: "catarat", word: "Climb", video: "03-catarat", poster: "poster-03-catarat", alt: "Rock climbing with rope and helmet" },
      { id: "apa", word: "Jump", video: "04-apa", poster: "poster-04-apa", alt: "Cliff jump into the sea" },
      { id: "alergare", word: "Run", video: "05-alergare", poster: "poster-05-alergare", alt: "Running on the beach at dawn" },
    ],
  },
  firstTime: {
    eyebrow: "For the first time",
    headline: "Someone teaches you how to start enjoying the gym — not how to endure it.",
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
    eyebrow: "The method",
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
  david: {
    eyebrow: "Who teaches you",
    headline: "7 years under the bar. Second year of medical school.",
    body: [
      "He walked into a gym at 13 and never stopped.",
      "He studies medicine, so he understands what happens inside the body when you lift — not just how many reps to do.",
      "He coaches people because he started where you are and knows exactly where it falls apart.",
    ],
    image: "david-formal",
    imageAlt: "David Biriș",
  },
  results: {
    eyebrow: "Results",
    headline: "Two people, two different starting points.",
    beforeLabel: "Before",
    afterLabel: "After",
    testimonials: [
      {
        id: "darius",
        name: "Darius B.",
        quote:
          "With David's help I didn't just change my body. The gym turned into a real hobby — and, more than that, so did the idea of getting a little better every day.",
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
    eyebrow: "How it works",
    headline: "Three steps, no forms.",
    steps: [
      { index: "01", title: "You write", body: "A message on WhatsApp or Instagram. The first conversation is free." },
      { index: "02", title: "We build the plan", body: "Starting from the sport you do, the time you have and what you eat now." },
      { index: "03", title: "We adjust", body: "Week by week, with direct access to David." },
    ],
  },
  faq: {
    eyebrow: "Questions",
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
    ],
  },
  finalCta: {
    headline: "The first conversation is free.",
    body: "You write, we talk, and I'll tell you honestly whether I can help. If it doesn't feel right for you, nothing happens.",
    cta: "Message David on WhatsApp",
  },
  footer: {
    disclaimer:
      "David Biriș is a medical student, not a doctor or a licensed nutritionist. This mentoring does not replace medical advice. If you have a health condition, talk to your doctor first.",
    languageLabel: "Language",
    rights: "David Biriș",
  },
};
