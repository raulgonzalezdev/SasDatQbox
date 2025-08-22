import type { Pathnames } from 'next-intl/navigation';

export const locales = ['es', 'en'] as const;
export type Locale = (typeof locales)[number];

export const pathnames = {
  '/': '/',
  '/about': '/about',
  '/blog': '/blog',
  '/security': '/security'
} satisfies Pathnames<typeof locales>;

export type AppPathnames = keyof typeof pathnames;
