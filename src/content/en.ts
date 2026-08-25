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
        "Three people who started from different places, and what changed. Before and after photos, in their own words. One-on-one mentoring, 100% online.",
    },
    despre: {
      title: "About David Biriș · Online fitness mentor",
      description:
        "7 years under the bar, my own results, and second year of medical school. I want to understand why things work, not just that they do. One-on-one mentoring, online.",
    },
  },
  business: {
    serviceType: "Online one-on-one fitness mentoring",
    areaServed: "Romania",
    audience: "People who want to look good and be fit without giving up the rest of their life",
    locationLine: "One-on-one fitness mentoring, 100% online. Wherever you are, in Romanian and English.",
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
    pickerBody: "It comes straight to me. No forms, no middleman.",
    whatsappNote: "The message is already written. Fastest reply here.",
    instagramNote: "If you'd rather see what I post first.",
    closeLabel: "Close",
  },
  hero: {
    headline: "A physique you're proud of,",
    headlineAccent: "without sacrificing your life.",
    subheadline:
      "One-on-one mentoring, 100% online. A training plan, nutrition and direct guidance from me, built to fit around university, work and your everyday life.",
    ctaPrimary: "Let's talk",
    ctaSecondary: "See the method",
    image: "david-gym",
    imageAlt: "David in the gym, shot in the mirror after training",
  },
  offer: {
    headline: "What the mentoring actually is.",
    body: "We work one-on-one, online. I build the plan, guide you on execution and adjust as we go, until you know exactly what you're doing in the gym and why.",
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
      "In the end you're not left with just a plan. You look good, you feel good in your own body, and you keep your degree, your job, your relationship, your friends and everything you do outside the gym.",
  },
  firstTime: {
    headline: "You don't want a training programme. You want to feel good in your own skin.",
    body: [
      "You want to look good in a t-shirt. To look in the mirror and like what you see. To walk into a room with confidence.",
      "You want to be strong, to have energy, and not to be out of breath at the first flight of stairs.",
      "The gym is only the tool that gets you there. I'm here to teach you how to use it, so that in two years, not training feels strange.",
    ],
    image: "training-bench",
    imageAlt: "David in the gym, between sets",
  },
  balance: {
    headline: "You don't have to give everything up to change your body.",
    beerCaption: "A beer on the beach doesn't undo your month. A beer every night does.",
    fastfoodCaption: "Neither does the airport burger. What counts is the rest of the week.",
    closing:
      "You need balance, not punishment. Plans that ban everything last a few weeks and then you drop them. A good plan lets you live normally.",
  },
  method: {
    headline: "Lifting is the base. Everything else sits around it.",
    body: "The physique is built in the gym. That's where the work happens and where everything starts. The five steps below help you turn the gym into something you can keep for the long run, without turning your life upside down.",
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
        angle: "You make room for the gym without giving up university, work, your relationship or your hobbies.",
      },
      {
        id: "ajustare",
        name: "Adjustment",
        angle: "I follow your progress and we change what isn't working, week by week.",
      },
    ],
    gallery: [
      { id: "sala", src: "metoda-oglinda", alt: "David shot in the gym mirror, between sets" },
      { id: "nutritie", src: "nutrition-plate", alt: "A plate of simply cooked food" },
      { id: "catarat", src: "climbing-wall", alt: "David climbing a wall on rope" },
    ],
  },
  reel: {
    headline: "Fitness should improve your life, not become your whole life.",
    body: "I train to look good. In the same week I box, run, climb and swim, and I still have time for university, for my friends and for my own life. I'm not teaching you those sports. They're just the proof that it can be done.",
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
      "I walked into a gym at 13 and never stopped. The physique I have now came out of those years, not out of a certificate.",
      "I study medicine along the way, which means I'm not satisfied with “that's how it's done”. I want to understand what happens inside the body when you lift, and why.",
      "I train you because I started where you are, made plenty of mistakes, and I know how hard it is to work out on your own what actually works.",
    ],
    image: "david-formal",
    imageAlt: "David Biriș",
    transformation: {
      headline: "I've been there too.",
      beforeSrc: "sea-rest",
      afterSrc: "outdoor-summit",
      beforeAlt: "David on the rocks by the sea, before the years of training",
      afterAlt: "David on a ridge, after years of training",
    },
  },
  results: {
    headline: "Three people, three starting points, the same method.",
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
        attribution: null,
        note: null,
        beforeAlt: "Darius before the mentoring",
        afterAlt: "Darius after the mentoring",
      },
      {
        id: "meril",
        name: "Meril",
        quote:
          "I came from Switzerland to study medicine and I don't speak Romanian. David and I understood each other perfectly from the start, and I made a lot of progress in a short time.",
        attribution: null,
        note: "The mentoring works in English too.",
        beforeAlt: "Meril before the mentoring",
        afterAlt: "Meril after the mentoring",
      },
      {
        id: "birisjr",
        name: "Biriș Jr.",
        quote:
          "He's my brother. I've always been there for him, and whenever he needed help he came to me. The results are in the photo.",
        attribution: "David",
        note: null,
        beforeAlt: "Biriș Jr. before the mentoring",
        afterAlt: "Biriș Jr. after the mentoring",
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
      { index: "03", title: "We adjust", body: "Week by week, with direct access to me." },
    ],
  },
  pricing: {
    headline: "What it costs.",
    planLabel: "One-on-one mentoring",
    amount: "349 RON",
    period: "/ month",
    launchLabel: "Launch price · first 10 spots",
    launchNote: "After the first 10 spots, the price goes to 399 RON/month.",
    perDay: "About 12 RON a day. Less than you spend on plenty of things without thinking twice.",
    includesLabel: "What you get",
    includes: [
      "A gym plan built for you",
      "Guidance on nutrition",
      "Feedback on your form",
      "Progress tracking",
      "Adjustments to the plan",
      "Direct access to me",
      "Support and accountability",
    ],
    cta: "Let's talk",
    ctaNote:
      "The first conversation is free. You tell me where you are now and what you want, and I'll tell you honestly whether I can help.",
    lockNote: "The launch price stays for the first 10 clients for as long as we keep working together.",
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
          "As much as your schedule allows. If you can do three days a week, we build the plan for three days. I'm not asking you to move your life around the gym.",
      },
      { question: "I don't have time, I'm at university.", answer: "So am I. That's why the plan is built around your schedule, not the other way round." },
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
          "It is. Lifting stays the base the physique is built on, and your sport is what you do on top. We arrange the two so they stop working against each other. I'm not teaching you your sport.",
      },
      {
        question: "I only want to lose weight, not compete.",
        answer:
          "Perfect. You don't have to compete to look good. Weight loss comes from what you eat during the rest of the week and from still walking into the gym next month, not from today's session. That is why the plan starts from the food you already eat.",
      },
    ],
  },
  finalCta: {
    headline: "The first conversation is free.",
    body: "You write, we talk, and I'll tell you honestly whether I can help. If it doesn't feel right for you, nothing happens.",
    cta: "Let's talk",
  },
  footer: {
    disclaimer:
      "I'm a medical student, not a doctor or a licensed nutritionist. This mentoring does not replace medical advice. If you have a health condition, talk to your doctor first.",
    languageLabel: "Language",
    rights: "David Biriș",
    contactLabel: "Message me directly",
    wordmark: "David Biriș",
  },
};
