import { getCollection, type CollectionEntry } from 'astro:content'
import { readingTime, calculateWordCountFromHtml } from '@/lib/utils'

export async function getAllBlogs(): Promise<CollectionEntry<'blog'>[]> {
  const blogs = await getCollection('blog')
  return blogs
    .filter((blog) => !blog.data.draft && !isSubblog(blog.id))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
}

// Alias for backward compatibility
export const getAllPosts = getAllBlogs

export async function getAllBlogsAndSubblogs(): Promise<
  CollectionEntry<'blog'>[]
> {
  const blogs = await getCollection('blog')
  return blogs
    .filter((blog) => !blog.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
}

export async function getAllProjects(): Promise<CollectionEntry<'projects'>[]> {
  const projects = await getCollection('projects')
  return projects.sort((a, b) => {
    // Sort by priority first (lower number = higher priority)
    const priorityA = a.data.priority || 999
    const priorityB = b.data.priority || 999

    if (priorityA !== priorityB) {
      return priorityA - priorityB
    }

    // If priorities are equal, sort by startDate (newest first)
    const dateA = a.data.startDate?.getTime() || 0
    const dateB = b.data.startDate?.getTime() || 0
    return dateB - dateA
  })
}

export async function getAllExperience(): Promise<
  CollectionEntry<'experience'>[]
> {
  const experience = await getCollection('experience')
  return experience.sort((a, b) => {
    const dateA = a.data.startDate?.getTime() || 0
    const dateB = b.data.startDate?.getTime() || 0
    return dateB - dateA
  })
}

export async function getAllTags(): Promise<Map<string, number>> {
  const blogs = await getAllBlogs()
  return blogs.reduce((acc, blog) => {
    blog.data.tags?.forEach((tag) => {
      acc.set(tag, (acc.get(tag) || 0) + 1)
    })
    return acc
  }, new Map<string, number>())
}

export async function getAdjacentBlogs(currentId: string): Promise<{
  newer: CollectionEntry<'blog'> | null
  older: CollectionEntry<'blog'> | null
  parent: CollectionEntry<'blog'> | null
}> {
  const allBlogs = await getAllBlogs()

  if (isSubblog(currentId)) {
    const parentId = getParentId(currentId)
    const allBlogs = await getAllBlogs()
    const parent = allBlogs.find((blog) => blog.id === parentId) || null

    const blogs = await getCollection('blog')
    const subblogs = blogs
      .filter(
        (blog) =>
          isSubblog(blog.id) &&
          getParentId(blog.id) === parentId &&
          !blog.data.draft,
      )
      .sort((a, b) => a.data.date.valueOf() - b.data.date.valueOf())

    const currentIndex = subblogs.findIndex((blog) => blog.id === currentId)
    if (currentIndex === -1) {
      return { newer: null, older: null, parent }
    }

    return {
      newer:
        currentIndex < subblogs.length - 1 ? subblogs[currentIndex + 1] : null,
      older: currentIndex > 0 ? subblogs[currentIndex - 1] : null,
      parent,
    }
  }

  const parentBlogs = allBlogs.filter((blog) => !isSubblog(blog.id))
  const currentIndex = parentBlogs.findIndex((blog) => blog.id === currentId)

  if (currentIndex === -1) {
    return { newer: null, older: null, parent: null }
  }

  return {
    newer: currentIndex > 0 ? parentBlogs[currentIndex - 1] : null,
    older:
      currentIndex < parentBlogs.length - 1
        ? parentBlogs[currentIndex + 1]
        : null,
    parent: null,
  }
}

export async function getBlogsByTag(
  tag: string,
): Promise<CollectionEntry<'blog'>[]> {
  const blogs = await getAllBlogs()
  return blogs.filter((blog) => blog.data.tags?.includes(tag))
}

// Alias for backward compatibility
export const getPostsByTag = getBlogsByTag

export async function getRecentBlogs(
  count: number,
): Promise<CollectionEntry<'blog'>[]> {
  const blogs = await getAllBlogs()
  return blogs.slice(0, count)
}

export async function getSortedTags(): Promise<
  { tag: string; count: number }[]
> {
  const tagCounts = await getAllTags()
  return [...tagCounts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => {
      const countDiff = b.count - a.count
      return countDiff !== 0 ? countDiff : a.tag.localeCompare(b.tag)
    })
}

export function getParentId(subblogId: string): string {
  return subblogId.split('/')[0]
}

export async function getSubblogsForParent(
  parentId: string,
): Promise<CollectionEntry<'blog'>[]> {
  const blogs = await getCollection('blog')
  return blogs
    .filter(
      (blog) =>
        !blog.data.draft &&
        isSubblog(blog.id) &&
        getParentId(blog.id) === parentId,
    )
    .sort((a, b) => a.data.date.valueOf() - b.data.date.valueOf())
}

// Alias for backward compatibility
export const getSubpostsForParent = getSubblogsForParent

export function groupBlogsByYear(
  blogs: CollectionEntry<'blog'>[],
): Record<string, CollectionEntry<'blog'>[]> {
  return blogs.reduce(
    (acc: Record<string, CollectionEntry<'blog'>[]>, blog) => {
      const year = blog.data.date.getFullYear().toString()
      ;(acc[year] ??= []).push(blog)
      return acc
    },
    {},
  )
}

// Alias for backward compatibility
export const groupPostsByYear = groupBlogsByYear

export async function hasSubblogs(blogId: string): Promise<boolean> {
  const subblogs = await getSubblogsForParent(blogId)
  return subblogs.length > 0
}

export function isSubblog(blogId: string): boolean {
  return blogId.includes('/')
}

// Alias for backward compatibility
export const isSubpost = isSubblog

export async function getParentBlog(
  subblogId: string,
): Promise<CollectionEntry<'blog'> | null> {
  if (!isSubblog(subblogId)) {
    return null
  }

  const parentId = getParentId(subblogId)
  const allBlogs = await getAllBlogs()
  return allBlogs.find((blog) => blog.id === parentId) || null
}

// Alias for backward compatibility
export const getParentPost = getParentBlog

export async function getBlogById(
  blogId: string,
): Promise<CollectionEntry<'blog'> | null> {
  const allBlogs = await getAllBlogsAndSubblogs()
  return allBlogs.find((blog) => blog.id === blogId) || null
}

// Alias for backward compatibility
export const getPostById = getBlogById

export async function getSubblogCount(parentId: string): Promise<number> {
  const subblogs = await getSubblogsForParent(parentId)
  return subblogs.length
}

// Alias for backward compatibility
export const getSubpostCount = getSubblogCount

export async function getCombinedReadingTime(blogId: string): Promise<string> {
  const blog = await getBlogById(blogId)
  if (!blog) return readingTime(0)

  let totalWords = calculateWordCountFromHtml(blog.body)

  if (!isSubblog(blogId)) {
    const subblogs = await getSubblogsForParent(blogId)
    for (const subblog of subblogs) {
      totalWords += calculateWordCountFromHtml(subblog.body)
    }
  }

  return readingTime(totalWords)
}

export async function getBlogReadingTime(blogId: string): Promise<string> {
  const blog = await getBlogById(blogId)
  if (!blog) return readingTime(0)

  const wordCount = calculateWordCountFromHtml(blog.body)
  return readingTime(wordCount)
}

// Alias for backward compatibility
export const getPostReadingTime = getBlogReadingTime
