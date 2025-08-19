import { createSharedPathnamesNavigation } from 'next-intl/navigation';
import { locales, pathnames } from '../types/i18n';

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({ locales, pathnames });
