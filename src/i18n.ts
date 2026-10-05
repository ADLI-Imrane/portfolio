export type Lang = 'fr' | 'en';

export const site = {
  name: 'Imrane Adli',
  email: 'imrane.adli.pro@gmail.com',
  linkedin: 'https://www.linkedin.com/in/imrane-adli',
  github: 'https://github.com/ADLI-Imrane',
  phone: '+212 6 27 28 04 07',
  whatsapp: 'https://wa.me/212627280407',
};

const fr = {
  meta: {
    title: 'Imrane Adli · Ingénieur logiciel full-stack',
    description:
      "Ingénieur logiciel junior à Casablanca. React, Node.js, Google Cloud et IA appliquée. Découvrez mes projets, de Tunneleads à WRX Generator.",
  },
  nav: { work: 'Projets', about: 'Profil', experience: 'Parcours', stack: 'Stack', contact: 'Me contacter' },
  hero: {
    status: 'Disponible pour un poste à temps plein',
    title: ['Ingénieur', 'logiciel', 'full-stack.'],
    lede:
      "Je conçois et je livre des produits web de bout en bout : l'interface, l'API, la base de données et le déploiement sur le cloud.",
    ctaPrimary: 'Voir mes projets',
    ctaSecondary: 'Me contacter',
    photoAlt: "Portrait d'Imrane Adli",
    location: 'Casablanca, Maroc',
  },
  stats: [
    { value: 4, suffix: '', label: 'expériences en entreprise' },
    { value: 1100, suffix: '+', label: 'contributions GitHub cette année' },
    { value: 800, suffix: '+', label: 'tests automatisés sur Tunneleads' },
    { value: 2, suffix: '', label: 'certifications Oracle Cloud' },
  ],
  about: {
    kicker: 'Profil',
    text:
      "Diplômé de l'EMSI en ingénierie informatique et réseaux, j'aime prendre un produit d'une page blanche jusqu'à des utilisateurs réels. J'ai livré un SIRH utilisé en production, une plateforme multiplateforme de liens et de QR codes, une application Flutter, et un SaaS qui analyse les appels commerciaux par IA, en darija comme en français.",
  },
  work: {
    kicker: 'Projets sélectionnés',
    title: 'Ce que j’ai construit',
    private: 'Code privé',
    company: "Code de l'entreprise",
    live: 'Voir le site',
    code: 'Voir le code',
  },
  projects: [
    {
      id: 'tunneleads',
      name: 'Tunneleads',
      tag: 'Projet de fin d’études · Qualeads · 2026',
      desc:
        "SaaS multi-entreprises qui récupère les appels depuis la téléphonie de l'entreprise, les relie au bon prospect, puis les transcrit et les analyse par IA : résumé, score, objections et conseils pour l'agent.",
      points: [
        'Base de données dédiée par client, rôles, MFA et journal d’audit',
        'Connecteur en Go sur site, en TLS mutuel, sans port ouvert',
        '124 fichiers de test, 800+ cas automatisés, pilote sur un vrai PBX',
      ],
      stack: ['Next.js', 'NestJS', 'Go', 'PostgreSQL', 'Google Cloud', 'Gemini'],
    },
    {
      id: 'wrx',
      name: 'WRX Generator v2',
      tag: 'Projet personnel · 2025–2026',
      desc:
        'Plateforme de liens courts et de QR codes personnalisés, disponible sur le web, sur mobile et en extension Chrome, avec paiements intégrés.',
      points: ['Monorepo pnpm avec paquets partagés', 'Paiements Stripe, données et auth Supabase', 'Web, API, extension navigateur et app mobile'],
      stack: ['React', 'NestJS', 'TypeScript', 'Supabase', 'Stripe'],
    },
    {
      id: 'hris',
      name: 'SIRH Omnidoc Santé',
      tag: 'Stage · Omnidoc Santé · 2025',
      desc:
        "Système d'information RH full-stack mis en production pour digitaliser la gestion des employés, des congés et de la paie.",
      points: ['Modélisation UML des processus RH', 'API REST sécurisée et gestion des rôles', 'Hébergé sur Microsoft Azure'],
      stack: ['React', 'Node.js', 'MySQL', 'Azure'],
    },
    {
      id: 'workout',
      name: 'WRX Workout',
      tag: 'Projet personnel · Mobile',
      desc: 'Application de fitness personnalisée avec quêtes quotidiennes, chatbot intelligent et stockage local hors ligne.',
      points: ['Quêtes et progression quotidiennes', 'Chatbot connecté via OpenRouter', 'Persistance locale avec Hive'],
      stack: ['Flutter', 'Dart', 'Hive', 'OpenRouter'],
    },
  ],
  more: {
    title: 'Aussi au compteur',
    items: [
      { name: 'Qualeads Management System', desc: 'Gestion de projets inspirée de Monday, adaptée aux workflows d’une agence de contenu.', stack: 'Next.js · TypeScript · PostgreSQL' },
      { name: 'Shopify AI Studio', desc: 'Photos produits automatisées avec Vertex AI et SEO assisté par IA pour Shopify.', stack: 'Next.js · Vertex AI · Shopify' },
    ],
  },
  experience: {
    kicker: 'Parcours',
    title: 'Expérience',
    items: [
      { period: 'févr. 2026 — aujourd’hui', role: 'Ingénieur logiciel full-stack', org: 'Qualeads', desc: 'Conception, développement et déploiement de Tunneleads, de la spécification à la démo complète.' },
      { period: 'juil. — sept. 2025', role: 'Développeur web (stage)', org: 'Omnidoc Santé', desc: 'Co-développement d’un SIRH en production : React, Node.js, MySQL, Azure.' },
      { period: 'juil. — sept. 2024', role: 'Développeur web (stage)', org: 'Qualeads', desc: 'Formulaire multi-étapes interactif modélisé en UML, développé en React, Redux et PHP.' },
      { period: 'juil. — sept. 2022', role: 'Développeur web (stage)', org: 'Declic Agency', desc: 'Bannières interactives pour Audi en HTML, CSS et AMP.' },
    ],
    education: {
      title: 'Formation',
      items: [
        { period: '2023 — 2026', role: "Cycle d'ingénieur, informatique et réseaux (MIAGE)", org: 'EMSI Casablanca' },
        { period: '2021 — 2023', role: 'Classes préparatoires intégrées', org: 'EMSI Casablanca' },
      ],
    },
    certs: {
      title: 'Certifications',
      items: ['Oracle Cloud Infrastructure 2025 — DevOps Professional', 'Oracle Cloud Infrastructure 2025 — Data Science Professional'],
    },
  },
  stack: { kicker: 'Stack', title: 'Les outils avec lesquels je travaille' },
  stackGroups: ['Langages', 'Frontend', 'Backend', 'Bases de données', 'Cloud & DevOps', 'Outils'],
  contact: {
    kicker: 'Contact',
    title: 'Construisons quelque chose ensemble.',
    text: 'Je cherche un poste d’ingénieur full-stack à Casablanca, sur site ou en hybride. Écrivez-moi, je réponds rapidement.',
    copy: "Copier l'e-mail",
    copied: 'E-mail copié',
  },
  footer: 'Conçu et développé par Imrane Adli avec Astro.',
  toggles: { theme: 'Changer de thème', lang: 'Switch to English' },
};

const en: typeof fr = {
  meta: {
    title: 'Imrane Adli · Full-stack software engineer',
    description:
      'Junior software engineer in Casablanca. React, Node.js, Google Cloud and applied AI. Explore my projects, from Tunneleads to WRX Generator.',
  },
  nav: { work: 'Work', about: 'About', experience: 'Experience', stack: 'Stack', contact: 'Get in touch' },
  hero: {
    status: 'Open to full-time roles',
    title: ['Full-stack', 'software', 'engineer.'],
    lede: 'I design and ship web products end to end: the interface, the API, the database and the cloud deployment.',
    ctaPrimary: 'See my work',
    ctaSecondary: 'Get in touch',
    photoAlt: 'Portrait of Imrane Adli',
    location: 'Casablanca, Morocco',
  },
  stats: [
    { value: 4, suffix: '', label: 'industry experiences' },
    { value: 1100, suffix: '+', label: 'GitHub contributions this year' },
    { value: 800, suffix: '+', label: 'automated tests on Tunneleads' },
    { value: 2, suffix: '', label: 'Oracle Cloud certifications' },
  ],
  about: {
    kicker: 'About',
    text:
      'I graduated from EMSI in Computer Science & Networks, and I like taking a product from a blank page to real users. I have shipped an HR system used in production, a cross-platform link and QR-code platform, a Flutter app, and a SaaS that analyzes sales calls with AI, in Darija as well as French.',
  },
  work: {
    kicker: 'Selected work',
    title: 'Things I’ve built',
    private: 'Private code',
    company: 'Company-owned code',
    live: 'Visit site',
    code: 'View code',
  },
  projects: [
    {
      id: 'tunneleads',
      name: 'Tunneleads',
      tag: 'Final-year project · Qualeads · 2026',
      desc:
        "Multi-tenant SaaS that fetches calls from a company's phone system, links them to the right lead, then transcribes and analyzes them with AI: summary, score, objections and coaching for the agent.",
      points: [
        'Database per tenant, roles, MFA and audit log',
        'On-premise Go connector over mutual TLS, no inbound ports',
        '124 test files, 800+ automated cases, piloted on a real PBX',
      ],
      stack: ['Next.js', 'NestJS', 'Go', 'PostgreSQL', 'Google Cloud', 'Gemini'],
    },
    {
      id: 'wrx',
      name: 'WRX Generator v2',
      tag: 'Personal project · 2025–2026',
      desc: 'Short-link and custom QR-code platform available on the web, on mobile and as a Chrome extension, with built-in payments.',
      points: ['pnpm monorepo with shared packages', 'Stripe payments, Supabase data and auth', 'Web app, API, browser extension and mobile app'],
      stack: ['React', 'NestJS', 'TypeScript', 'Supabase', 'Stripe'],
    },
    {
      id: 'hris',
      name: 'Omnidoc Santé HRIS',
      tag: 'Internship · Omnidoc Santé · 2025',
      desc: 'Full-stack HR information system put into production to digitize employee records, leave requests and payroll.',
      points: ['UML modeling of HR processes', 'Secure REST API and role management', 'Hosted on Microsoft Azure'],
      stack: ['React', 'Node.js', 'MySQL', 'Azure'],
    },
    {
      id: 'workout',
      name: 'WRX Workout',
      tag: 'Personal project · Mobile',
      desc: 'Personalized fitness app with daily quests, a smart chatbot and offline local storage.',
      points: ['Daily quests and progression', 'Chatbot powered through OpenRouter', 'Local persistence with Hive'],
      stack: ['Flutter', 'Dart', 'Hive', 'OpenRouter'],
    },
  ],
  more: {
    title: 'Also built',
    items: [
      { name: 'Qualeads Management System', desc: 'Monday-style project management tailored to a content agency’s workflows.', stack: 'Next.js · TypeScript · PostgreSQL' },
      { name: 'Shopify AI Studio', desc: 'Automated product photography with Vertex AI and AI-assisted SEO for Shopify.', stack: 'Next.js · Vertex AI · Shopify' },
    ],
  },
  experience: {
    kicker: 'Journey',
    title: 'Experience',
    items: [
      { period: 'Feb 2026 — now', role: 'Full-stack software engineer', org: 'Qualeads', desc: 'Designed, built and deployed Tunneleads, from spec to full working demo.' },
      { period: 'Jul — Sep 2025', role: 'Web developer intern', org: 'Omnidoc Santé', desc: 'Co-developed an HRIS in production: React, Node.js, MySQL, Azure.' },
      { period: 'Jul — Sep 2024', role: 'Web developer intern', org: 'Qualeads', desc: 'Interactive multi-step form modeled in UML, built with React, Redux and PHP.' },
      { period: 'Jul — Sep 2022', role: 'Web developer intern', org: 'Declic Agency', desc: 'Interactive banners for Audi in HTML, CSS and AMP.' },
    ],
    education: {
      title: 'Education',
      items: [
        { period: '2023 — 2026', role: 'Engineering degree, Computer Science & Networks (MIAGE)', org: 'EMSI Casablanca' },
        { period: '2021 — 2023', role: 'Integrated preparatory classes', org: 'EMSI Casablanca' },
      ],
    },
    certs: {
      title: 'Certifications',
      items: ['Oracle Cloud Infrastructure 2025 — DevOps Professional', 'Oracle Cloud Infrastructure 2025 — Data Science Professional'],
    },
  },
  stack: { kicker: 'Stack', title: 'The tools I work with' },
  stackGroups: ['Languages', 'Frontend', 'Backend', 'Databases', 'Cloud & DevOps', 'Tools'],
  contact: {
    kicker: 'Contact',
    title: 'Let’s build something together.',
    text: 'I’m looking for a full-stack engineering role in Casablanca, on-site or hybrid. Drop me a line, I reply quickly.',
    copy: 'Copy email',
    copied: 'Email copied',
  },
  footer: 'Designed and built by Imrane Adli with Astro.',
  toggles: { theme: 'Toggle theme', lang: 'Passer en français' },
};

export const t = { fr, en };

export const stack: [string, string][][] = [
  [['ts', 'TypeScript'], ['js', 'JavaScript'], ['go', 'Go'], ['py', 'Python'], ['java', 'Java'], ['php', 'PHP'], ['dart', 'Dart'], ['cs', 'C#'], ['cpp', 'C++'], ['c', 'C']],
  [['react', 'React'], ['nextjs', 'Next.js'], ['angular', 'Angular'], ['flutter', 'Flutter'], ['redux', 'Redux'], ['tailwind', 'Tailwind'], ['bootstrap', 'Bootstrap'], ['html', 'HTML5'], ['css', 'CSS3']],
  [['nodejs', 'Node.js'], ['nestjs', 'NestJS'], ['spring', 'Spring Boot'], ['django', 'Django'], ['prisma', 'Prisma']],
  [['postgres', 'PostgreSQL'], ['mysql', 'MySQL'], ['mongodb', 'MongoDB'], ['supabase', 'Supabase']],
  [['gcp', 'Google Cloud'], ['azure', 'Azure'], ['docker', 'Docker'], ['terraform', 'Terraform'], ['linux', 'Linux'], ['cloudflare', 'Cloudflare']],
  [['git', 'Git'], ['github', 'GitHub'], ['vscode', 'VS Code'], ['postman', 'Postman']],
];
