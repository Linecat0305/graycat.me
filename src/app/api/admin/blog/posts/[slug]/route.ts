import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'content/blog')

// Simple authentication middleware for demo purposes
// In a real application, use proper authentication
function authenticate(req: NextRequest) {
  // For demo purposes only - in a real app, implement proper authentication
  const auth = req.headers.get('authorization')
  // This is a simple placeholder for demo purposes
  return true
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  // Check authentication
  if (!authenticate(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Safely access params
  const slug = params?.slug
  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
  }

  try {
    const body = await req.json()
    const { title, content, description, date, tags } = body

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
    }

    // Check if post exists
    const filePath = path.join(postsDirectory, `${slug}.md`)
    if (!fs.existsSync(filePath)) {
      // Try with mdx extension
      const mdxFilePath = path.join(postsDirectory, `${slug}.mdx`)
      if (!fs.existsSync(mdxFilePath)) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 })
      }
    }

    // Create frontmatter
    const frontmatter = {
      title,
      date: date || new Date().toISOString(),
      description: description || '',
      tags: tags || []
    }

    // Generate markdown with frontmatter
    const markdown = matter.stringify(content, frontmatter)

    // Write to file (using the same extension it had before)
    const mdFilePath = path.join(postsDirectory, `${slug}.md`)
    const mdxFilePath = path.join(postsDirectory, `${slug}.mdx`)
    
    if (fs.existsSync(mdFilePath)) {
      fs.writeFileSync(mdFilePath, markdown)
    } else if (fs.existsSync(mdxFilePath)) {
      fs.writeFileSync(mdxFilePath, markdown)
    } else {
      fs.writeFileSync(mdFilePath, markdown)
    }

    return NextResponse.json({ success: true, slug })
  } catch (error) {
    console.error('Error updating blog post:', error)
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  // Check authentication
  if (!authenticate(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Safely access params
  const slug = params?.slug
  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
  }

  try {
    // Check if post exists
    const mdFilePath = path.join(postsDirectory, `${slug}.md`)
    const mdxFilePath = path.join(postsDirectory, `${slug}.mdx`)
    
    let fileExists = false
    
    if (fs.existsSync(mdFilePath)) {
      fs.unlinkSync(mdFilePath)
      fileExists = true
    }
    
    if (fs.existsSync(mdxFilePath)) {
      fs.unlinkSync(mdxFilePath)
      fileExists = true
    }
    
    if (!fileExists) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, slug })
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 })
  }
}