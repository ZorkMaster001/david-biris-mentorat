import type { Content } from "./types";

export const en: Content = {
  meta: {
    title: "Online 1-on-1 fitness mentoring · David Biriș",
    description:
      "I help you build a physique you're proud of, without sacrificing your life for it. One-on-one mentoring, 100% online: training plan, nutrition, form feedback and weekly adjustments.",
  },
  pageMeta: {
    metoda: {
      title: "The method · Lifting is the base, your life stays yours",
      description:
        "Five steps: training, progress, nutrition, lifestyle, adjustment. Lifting is the base the physique is built on, and the rest fits around the life you already have.",
    },
    rezultate: {
      title: "Real results · Online 1-on-1 mentoring",
      description:
        "Two people who started from different places, and what changed. Before and after photos, in their own words. One-on-one mentoring, 100% online.",
    },
    despre: {
      title: "About David Biriș · Online fitness mentor",
      description:
        "7 years under the bar, his own results, and second year of medical school. The urge to understand why things work, not just that they do. One-on-one mentoring, online.",
    },
  },
  business: {
    serviceType: "Online one-on-one fitness mentoring",
    areaServed: "Romania",
    audience: "People who want to look good and be fit without giving up the rest of their life",
    locationLine: "One-on-one mentoring, 100% online. From Târgu Mureș, in Romanian and English.",
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
    headline: "A physique you're proud of,",
    headlineAccent: "without sacrificing your life.",
    subheadline:
      "One-on-one mentoring, 100% online. A training plan, nutrition and direct guidance from me, laid over university, work and everything you already do.",
    ctaPrimary: "Message David",
    ctaSecondary: "See the method",
    image: "david-gym",
    imageAlt: "David in the gym, shot in the mirror after training",
  },
  offer: {
    headline: "What the mentoring actually is.",
    body: "We work one-on-one, online. I build the plan, guide you on execution and adjust as we go, until the gym stops being something you attempt and becomes something you know how to do.",
    items: [
      { id: "online", label: "100% online", detail: "From wherever you are, in Romanian or in English." },
      {
        id: "program",
        label: "A plan built for you",
        detail: "Around your goal, your level and the time you actually have.",
      },
      {
        id: "ghidare",
        label: "Guidance on training",
        detail: "Which exercises, how many sets, how much to load and how each one is performed.",
      },
      {
        id: "feedback",
        label: "Feedback on your form",
        detail: "You send me clips from the gym, I tell you exactly what to fix.",
      },
      {
        id: "nutritie",
        label: "The nutrition basics",
        detail: "How much and what you eat, starting from the food you already eat.",
      },
      {
        id: "progres",
        label: "Progress and adjustments",
        detail: "We track what changes and rework the plan before it stalls.",
      },
      {
        id: "acces",
        label: "Direct access to me",
        detail: "You message me when you have a question. You're not talking to an app.",
      },
    ],
    closingLabel: "The result",
    closing:
      "Not a list of services, but what's left of it: you look good, feel good in your own body, and still keep your degree, your job, your relationship, your friends and everything you do outside the gym.",
  },
  firstTime: {
    headline: "You don't want a training programme. You want to feel good in your own skin.",
    body: [
      "You want to look good in a t-shirt. To look in the mirror and like what you see. To walk into a room with confidence.",
      "You want to be strong, to have energy, and not to be out of breath at the first flight of stairs.",
      "The gym is only the tool that gets you there. My job is to put it in your hands and teach you to use it, so that in two years, not training feels strange.",
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
    headline: "Lifting is the base. Everything else sits around it.",
    body: "The physique is built in the gym. That's where the work happens and where everything starts. The five steps below are how the gym gets into your life and stays there, without taking it over.",
    pillars: [
      {
        id: "antrenament",
        name: "Training",
        angle: "A gym plan built on your goal, your level and the time you have.",
      },
      {
        id: "progres",
        name: "Progress",
        angle: "You learn how to lift properly, how to add load and how to track your results.",
      },
      {
        id: "nutritie",
        name: "Nutrition",
        angle: "Eating habits you can keep, not an extreme diet you drop after two weeks.",
      },
      {
        id: "lifestyle",
        name: "Lifestyle",
        angle: "The gym goes on top of university, work, your relationship and your hobbies. Not instead of them.",
      },
      {
        id: "ajustare",
        name: "Adjustment",
        angle: "I follow your progress and we change what isn't working, week by week.",
      },
    ],
    gallery: [
      { id: "sala", src: "poster-01-sala", alt: "David training in the gym" },
      { id: "nutritie", src: "nutrition-plate", alt: "A plate of simply cooked food" },
      { id: "catarat", src: "climbing-wall", alt: "David climbing a wall on rope" },
    ],
  },
  reel: {
    headline: "Fitness should improve your life, not become your whole life.",
    body: "David trains to look good. In the same week he boxes, runs, climbs and swims, and still has time for university, for his friends and for his own life. He doesn't teach you those sports. They're just the proof that it can be done.",
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
    headline: "7 years under the bar. And the urge to know why it works.",
    body: [
      "He walked into a gym at 13 and never stopped. The physique he has now came out of those years, not out of a certificate.",
      "He studies medicine along the way, which means he isn't satisfied with “that's how it's done”. He wants to know what happens inside the body when you lift, and why.",
      "He coaches people because he started where you are, got everything wrong that there was to get wrong, and knows exactly where it falls apart.",
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
    headline: "Two people, two starting points, the same method.",
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
      {
        index: "02",
        title: "We build the plan",
        body: "Starting from your goal, the time you have and what you eat right now.",
      },
      { index: "03", title: "We adjust", body: "Week by week, with direct access to David." },
    ],
  },
  faq: {
    headline: "What's actually stopping you.",
    items: [
      {
        question: "How does it work if it's all online?",
        answer:
          "You get the plan in writing, with exercises, sets and load. You send me clips from the gym, I give you feedback on your form, and we adjust weekly. We don't need to be in the same room for me to see what you're doing wrong.",
      },
      {
        question: "How much time a week does it take?",
        answer:
          "As much as you have. The plan is built around your time, not the other way round. If you can do three days a week, the plan has three days. I'm not asking you to move your life around the gym.",
      },
      { question: "I don't have time, I'm at university.", answer: "So is David. The plan is built around your schedule, not the other way round." },
      { question: "I've never set foot in a gym.", answer: "That's the best case. You have no bad habits to unlearn." },
      {
        question: "Do I have to give up going out and drinking?",
        answer:
          "No. A plan that bans everything lasts three weeks. We build one that has room for going out, because otherwise you won't stick to it.",
      },
      { question: "I don't speak Romanian.", answer: "Neither does Meril. The mentoring runs in English." },
      {
        question: "I already play another sport. Is this still for me?",
        answer:
          "It is. Lifting stays the base the physique is built on, and your sport is what you do on top. We arrange the two so they stop working against each other. He isn't teaching you your sport.",
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
