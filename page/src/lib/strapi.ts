/**
 * Strapi API Client
 * Utility functions to fetch content from Strapi CMS
 */

const STRAPI_URL = import.meta.env.PUBLIC_STRAPI_URL || 'http://localhost:1337';

export interface PortfolioData {
  about: string;
  experience: string;
  skills: string;
  contact: string;
  help: string;
}

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  content: string;
}

export interface StrapiPortfolioResponse {
  data: {
    id: number;
    documentId: string;
    about: string;
    experience: string;
    skills: string;
    contact: string;
    help: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
  meta: Record<string, unknown>;
}

export interface StrapiBlogPostResponse {
  data: Array<{
    id: number;
    documentId: string;
    postId: string;
    title: string;
    date: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  }>;
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

/**
 * Fetch portfolio content from Strapi
 */
export async function fetchPortfolio(): Promise<PortfolioData | null> {
  try {
    const response = await fetch(`${STRAPI_URL}/api/portfolio`);
    if (!response.ok) {
      console.warn('Failed to fetch portfolio from Strapi:', response.status);
      return null;
    }
    const json: StrapiPortfolioResponse = await response.json();
    return {
      about: json.data.about,
      experience: json.data.experience,
      skills: json.data.skills,
      contact: json.data.contact,
      help: json.data.help,
    };
  } catch (error) {
    console.warn('Error fetching portfolio from Strapi:', error);
    return null;
  }
}

/**
 * Fetch blog posts from Strapi
 */
export async function fetchBlogPosts(): Promise<BlogPost[] | null> {
  try {
    const response = await fetch(`${STRAPI_URL}/api/blog-posts?sort=date:desc`);
    if (!response.ok) {
      console.warn('Failed to fetch blog posts from Strapi:', response.status);
      return null;
    }
    const json: StrapiBlogPostResponse = await response.json();
    return json.data.map((post) => ({
      id: post.postId,
      title: post.title,
      date: post.date,
      content: post.content,
    }));
  } catch (error) {
    console.warn('Error fetching blog posts from Strapi:', error);
    return null;
  }
}

/**
 * Fetch all portfolio data including blog posts
 */
export async function fetchAllPortfolioData(): Promise<{
  portfolio: PortfolioData | null;
  blogPosts: BlogPost[] | null;
}> {
  const [portfolio, blogPosts] = await Promise.all([
    fetchPortfolio(),
    fetchBlogPosts(),
  ]);
  return { portfolio, blogPosts };
}
