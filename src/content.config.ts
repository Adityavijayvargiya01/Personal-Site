import { glob } from 'astro/loaders'
import { defineCollection, z } from 'astro:content'

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      image: image().optional(),
      tags: z.array(z.string()).optional(),
      author: z.string().optional(),
      draft: z.boolean().optional(),
    }),
})

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      description: z.string(),
      tags: z.array(z.string()),
      image: image(),
      link: z.string().url(),
      startDate: z.coerce.date().optional(),
      endDate: z.coerce.date().optional(),
      priority: z.number().optional(),
    }),
})

const experience = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/experience' }),
  schema: ({ image }) =>
    z.object({
      company: z.string(),
      position: z.string(),
      description: z.string(),
      location: z.string().optional(),
      tags: z.array(z.string()),
      image: image().optional(),
      link: z.string().url().optional(),
      startDate: z.coerce.date(),
      endDate: z.coerce.date().optional(),
    }),
})

export const collections = { blog, projects, experience }
