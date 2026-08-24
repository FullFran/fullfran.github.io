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
  intro: string;
  nowTitle: string;
  now: string[];
  writingTitle: string;
  writingIntro: string;
  terminalHint: string;
  linksLabel: string;
  allWritingLabel: string;
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
    tagline: 'Físico. Construyo sistemas de IA que llegan a producción.',
    intro:
      'Soy Fran. Uso IA y simulaciones para resolver problemas de física. Por el camino me aficioné a construir IA que aguanta el mundo real —tráfico real, datos reales, usuarios reales— y ya no paré. Ahora soy Chief Data Scientist en Hagalink. Antes fundé BlakIA. Pero esto no es mi CV —para eso está /cv—. Esto es dónde pienso en público.',
    nowTitle: 'Ahora',
    now: [
      'Chief Data Scientist en Hagalink — sistemas de IA de punta a punta.',
      'Doctorando en IA aplicada.',
      'Formando a mi equipo y a mis alumnos para construir IA que aguante producción.',
    ],
    writingTitle: 'Escribo',
    writingIntro: 'Notas sobre IA en producción, física, teclados y lo que se cruce.',
    terminalHint: 'pulsa ~ para la terminal',
    linksLabel: 'Enlaces',
    allWritingLabel: 'Ver todo lo que he escrito \u2192',
  },
  en: {
    tagline: 'Physicist. I build AI systems that ship.',
    intro:
      "I'm Fran. I use AI and simulations to solve physics problems. Along the way I got hooked on building AI that survives the real world —real traffic, real data, real users— and never stopped. I'm Chief Data Scientist at Hagalink. Before that I founded BlakIA. But this isn't my CV —that's at /cv—. This is where I think out loud.",
    nowTitle: 'Now',
    now: [
      'Chief Data Scientist at Hagalink — end-to-end AI systems.',
      'PhD candidate in applied AI.',
      'Training my team and my students to build AI that survives production.',
    ],
    writingTitle: 'Writing',
    writingIntro: 'Notes on production AI, physics, keyboards, and whatever else comes up.',
    terminalHint: 'press ~ for terminal',
    linksLabel: 'Links',
    allWritingLabel: 'See everything I have written \u2192',
  },
};
