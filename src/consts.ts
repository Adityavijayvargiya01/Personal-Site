import type { IconMap, SocialLink, Site } from '@/types'

export const SITE: Site = {
  title: 'Aditya Vijayvargiya',
  description:
    'Personal Blog Site',
  href: 'https://adityavijayvargiya.live',
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
  Website: 'ph:globe-duotone',
  GitHub: 'ph:github-logo-duotone',
  LinkedIn: 'ph:linkedin-logo-duotone',
  Twitter: 'ph:x-logo-duotone',
  Email: 'ph:envelope-duotone',
  RSS: 'ph:rss-duotone',
}
