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
      'Soy Fran. Uso IA y simulaciones para resolver problemas de física, y por el camino me aficioné a construir IA que aguanta el mundo real (tráfico real, datos reales, usuarios reales). Ahora llevo la IA en Hagalink; antes fundé una empresa y sus clientes se vinieron conmigo. Pero eso está en el /cv y ahí se queda: aquí escribo de lo que me apetece.',
    nowTitle: 'Ahora',
    now: [
      'Lead AI Engineer en Hagalink: agentes y RAG en producción, y la parte que nadie quiere, que es medir si funcionan.',
      'Doctorado en IA aplicada en la Universidad de Córdoba, con el CIEMAT.',
      'Doy formación de IA a mi equipo, a empresas cliente y a mis alumnos. El material lo escribo yo y está publicado.',
    ],
    writingTitle: 'Escribo',
    writingIntro: 'Notas sobre IA, física, teclados y lo que se cruce.',
    terminalHint: 'pulsa ~ para la terminal',
    linksLabel: 'Enlaces',
    allWritingLabel: 'Ver todo lo que he escrito →',
  },
  en: {
    tagline: 'Physicist. I build AI systems.',
    intro:
      "I'm Fran. I use AI and simulations to solve physics problems, and along the way I got hooked on building AI that survives the real world (real traffic, real data, real users). I lead the AI side of Hagalink now; before that I founded a company, and its clients came with me. But that lives in the /cv and it can stay there: here I write about whatever I feel like.",
    nowTitle: 'Now',
    now: [
      'Lead AI Engineer at Hagalink: agents and RAG in production, plus the part nobody wants, which is measuring whether they work.',
      'PhD in applied AI at the University of Córdoba, with CIEMAT.',
      'I train my team, client companies and my students. I write the material myself and it is public.',
    ],
    writingTitle: 'Writing',
    writingIntro: 'Notes on AI, physics, keyboards, and whatever else comes up.',
    terminalHint: 'press ~ for terminal',
    linksLabel: 'Links',
    allWritingLabel: 'See everything I have written →',
  },
};
