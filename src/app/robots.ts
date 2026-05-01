import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard/',
        '/profile/',
        '/wardrobe/',
        '/settings/',
        '/api/',
      ],
    },
    sitemap: 'https://drapeai.in/sitemap.xml',
  };
}
