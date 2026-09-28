export type Locale = 'es' | 'en';

export interface Post {
  slug: string;
  title: string;
  date: string;
  lang: Locale;
  description: string;
  body: string;
}

export interface SiteCopy {
  tagline: string;
  aboutTitle: string;
  aboutFile: string;
  about: string[];
  nowCommand: string;
  blogTitle: string;
  contactTitle: string;
  contactText: string;
  cvButton: string;
  nowTitle: string;
  now: string[];
  writingTitle: string;
  writingIntro: string;
  terminalHint: string;
  linksLabel: string;
  allWritingLabel: string;
  showMoreLabel: string;
}

export const name = 'Francisco Olmedo';

export const links: { label: string; href: string; external: boolean }[] = [
  { label: 'GitHub', href: 'https://github.com/FullFran', external: true },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/francisco-olmedo-cortes/', external: true },
  { label: 'Email', href: 'mailto:franciscomanuelolmedocortes@gmail.com', external: true },
  { label: 'CV', href: '/cv', external: false },
  { label: 'RSS', href: '/rss.xml', external: false },
];

export const site: Record<Locale, SiteCopy> = {
  es: {
    tagline: 'Físico. Construyo sistemas de IA.',
    aboutTitle: 'Sobre mí',
    aboutFile: 'sobre-mi.md',
    about: [
      'Soy Fran. Estudié Física y empecé usando IA y simulaciones para resolver problemas de física. Por el camino me aficioné a construir IA que aguanta el mundo real (tráfico real, datos reales, usuarios reales), y ahí sigo.',
      'Antes fundé una empresa y sus clientes se vinieron conmigo. Hoy llevo la IA en Hagalink, sigo con el doctorado y enseño lo que voy aprendiendo. El detalle está en el /cv; aquí escribo de lo que me apetece.',
      'Fuera del trabajo vivo en la terminal: Pop!_OS con ventanas en mosaico, Neovim y un teclado partido de 34 teclas. Si te pica la curiosidad, pulsa ~.',
    ],
    nowCommand: '$ cat ahora.txt',
    blogTitle: 'Blog',
    contactTitle: 'Contacto',
    contactText:
      'Si quieres comentar algo de lo que escribo, o tienes un problema que huele a física o a IA, escríbeme.',
    cvButton: 'Ver CV',
    nowTitle: 'Ahora',
    now: [
      'En Hagalink: agentes y RAG en producción, y la parte que nadie quiere, que es medir si funcionan.',
      'Doctorado en IA aplicada en la Universidad de Córdoba, con el CIEMAT.',
      'Doy formación de IA a mi equipo, a empresas cliente y a mis alumnos. El material lo escribo yo y está publicado.',
    ],
    writingTitle: 'Escribo',
    writingIntro: 'Notas sobre IA, física, teclados y lo que se cruce.',
    terminalHint: 'pulsa ~ para la terminal',
    linksLabel: 'Enlaces',
    allWritingLabel: 'Ver todo lo que he escrito →',
    showMoreLabel: 'Ver más',
  },
  en: {
    tagline: 'Physicist. I build AI systems.',
    aboutTitle: 'About me',
    aboutFile: 'about.md',
    about: [
      "I'm Fran. I studied physics and started using AI and simulations to solve physics problems. Along the way I got hooked on building AI that survives the real world (real traffic, real data, real users), and I'm still at it.",
      'Before this I founded a company, and its clients came with me. Now I lead the AI side of Hagalink, keep going with my PhD and teach what I learn along the way. The details live in the /cv; here I write about whatever I feel like.',
      "Outside work I live in the terminal: Pop!_OS with tiling windows, Neovim and a 34-key split keyboard. If you're curious, press ~.",
    ],
    nowCommand: '$ cat now.txt',
    blogTitle: 'Blog',
    contactTitle: 'Contact',
    contactText:
      'If you want to talk about something I wrote, or you have a problem that smells like physics or AI, drop me a line.',
    cvButton: 'See CV',
    nowTitle: 'Now',
    now: [
      'At Hagalink: agents and RAG in production, plus the part nobody wants, which is measuring whether they work.',
      'PhD in applied AI at the University of Córdoba, with CIEMAT.',
      'I train my team, client companies and my students. I write the material myself and it is public.',
    ],
    writingTitle: 'Writing',
    writingIntro: 'Notes on AI, physics, keyboards, and whatever else comes up.',
    terminalHint: 'press ~ for terminal',
    linksLabel: 'Links',
    allWritingLabel: 'See everything I have written →',
    showMoreLabel: 'Show more',
  },
};
