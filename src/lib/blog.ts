import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'content/blog')

export type BlogPost = {
  slug: string
  title: string
  date: string
  description: string
  content: string
  tags: string[]
  image?: string
}

export function getAllPostSlugs() {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }
  
  const fileNames = fs.readdirSync(postsDirectory)
  return fileNames
    .filter(fileName => fileName.endsWith('.md') || fileName.endsWith('.mdx'))
    .map(fileName => ({
      params: {
        slug: fileName.replace(/\.mdx?$/, '')
      }
    }))
}

export function getAllPosts() {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }
  
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.md') || fileName.endsWith('.mdx'))
    .map(fileName => {
      const slug = fileName.replace(/\.mdx?$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)
      
      return {
        slug,
        title: data.title,
        date: data.date,
        description: data.description || '',
        content,
        tags: data.tags || [],
        image: data.image || null
      } as BlogPost
    })
    
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}

export function getPostBySlug(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)
    
    return {
      slug,
      title: data.title,
      date: data.date,
      description: data.description || '',
      content,
      tags: data.tags || [],
      image: data.image || null
    }
  } catch (e) {
    try {
      // Try with mdx extension if md fails
      const fullPath = path.join(postsDirectory, `${slug}.mdx`)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)
      
      return {
        slug,
        title: data.title,
        date: data.date,
        description: data.description || '',
        content,
        tags: data.tags || [],
        image: data.image || null
      }
    } catch (e) {
      return null
    }
  }
}