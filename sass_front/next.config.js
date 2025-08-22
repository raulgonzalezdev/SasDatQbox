import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'thumbs.dreamstime.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'sp-ao.shortpixel.ai',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'www.origensalud.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'media.istockphoto.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'connect.bcbstx.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'mejorconsalud.as.com',
        pathname: '**',
      },
    ],
  },
};

export default withNextIntl(nextConfig); 