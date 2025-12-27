import type { IconMap, SocialLink, Site } from '@/types'

export const SITE: Site = {
  title: 'Aditya Vijayvargiya',
  description:
    'Personal Blog Site',
  href: 'https://adityavijayvargiya.me',
  author: 'Aditya',
  locale: 'en-US',
  featuredBlogCount: 2,
  blogsPerPage: 10,
}

export const NAV_LINKS: SocialLink[] = [
  {
    href: '/blogs',
    label: 'blogs',
  },
  {
    href: '#experience',
    label: 'experience',
  },
  {
    href: '#projects',
    label: 'projects',
  },
  {
    href: '#socials',
    label: 'socials',
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
]

export const ICON_MAP: IconMap = {
  Website: 'ph:globe-duotone',
  GitHub: 'ph:github-logo-duotone',
  LinkedIn: 'ph:linkedin-logo-duotone',
  Twitter: 'ph:x-logo-duotone',
  Email: 'ph:envelope-duotone',
  RSS: 'ph:rss-duotone',
}
