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
    tagline: 'Físico. Construyo sistemas de IA.',
    intro:
      'Soy Fran. Uso IA y simulaciones para resolver problemas de física, y por el camino me aficioné a construir IA que aguanta el mundo real —tráfico real, datos reales, usuarios reales—. Ahora soy Chief Data Scientist en Hagalink; antes fundé una startup. Pero eso está en el /cv y ahí se queda: aquí escribo de lo que me apetece.',
    nowTitle: 'Ahora',
    now: [
      'Chief Data Scientist en Hagalink — sistemas de IA de punta a punta.',
      'Doctorando en IA aplicada.',
      'Formando a mi equipo y a mis alumnos para construir IA.',
    ],
    writingTitle: 'Escribo',
    writingIntro: 'Notas sobre IA, física, teclados y lo que se cruce.',
    terminalHint: 'pulsa ~ para la terminal',
    linksLabel: 'Enlaces',
    allWritingLabel: 'Ver todo lo que he escrito \u2192',
  },
  en: {
    tagline: 'Physicist. I build AI systems.',
    intro:
      "I'm Fran. I use AI and simulations to solve physics problems, and along the way I got hooked on building AI that survives the real world —real traffic, real data, real users—. I'm Chief Data Scientist at Hagalink; before that I founded a startup. But that lives in the /cv and it can stay there: here I write about whatever I feel like.",
    nowTitle: 'Now',
    now: [
      'Chief Data Scientist at Hagalink — end-to-end AI systems.',
      'PhD candidate in applied AI.',
      'Training my team and my students to build AI.',
    ],
    writingTitle: 'Writing',
    writingIntro: 'Notes on AI, physics, keyboards, and whatever else comes up.',
    terminalHint: 'press ~ for terminal',
    linksLabel: 'Links',
    allWritingLabel: 'See everything I have written \u2192',
  },
};
