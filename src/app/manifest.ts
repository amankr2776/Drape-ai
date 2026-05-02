import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'DRAPE AI | Luxury Personal Stylist',
    short_name: 'DRAPE AI',
    description: 'Precision aesthetic meets intelligent silhouette mapping for the modern Indian wardrobe.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0A0A0F',
    theme_color: '#C9A84C',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}