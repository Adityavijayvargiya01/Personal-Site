import type { IconMap, SocialLink, Site } from '@/types'

export const SITE: Site = {
  title: 'Aditya Vijayvargiya',
  description:
    'Personal Blog Site',
  href: 'https://astro-erudite.vercel.app',
  author: 'Aditya',
  locale: 'en-US',
  featuredPostCount: 2,
  postsPerPage: 10,
}

export const NAV_LINKS: SocialLink[] = [
  {
    href: '/blog',
    label: 'blog',
  },
  {
    href: '/projects',
    label: 'projects',
  },
  {
    href: '/experience',
    label: 'experience',
  },
]

export const SOCIAL_LINKS: SocialLink[] = [
  {
    href: 'https://github.com/Adityavijayvargiya01',
    label: 'GitHub',
  },
  {
    href: 'https://x.com/adityavijay01',
    label: 'Twitter',
  },
  {
    href: 'https://www.linkedin.com/in/aditya-vijayvargiya-15034924a/',
    label: 'LinkedIn',
  },
  {
    href: 'mailto:adityavijayvargiya2022@gmail.com',
    label: 'Email',
  },
  {
    href: '/rss.xml',
    label: 'RSS', 
  },
]

export const ICON_MAP: IconMap = {
  Website: 'lucide:globe',
  GitHub: 'lucide:github',
  LinkedIn: 'lucide:linkedin',
  Twitter: 'lucide:twitter',
  Email: 'lucide:mail',
  RSS: 'lucide:rss',
}
