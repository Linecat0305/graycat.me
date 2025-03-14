import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'content/blog')

// Ensure blog directory exists
if (!fs.existsSync(postsDirectory)) {
  fs.mkdirSync(postsDirectory, { recursive: true })
}

// Simple authentication middleware for demo purposes
// In a real application, use proper authentication
function authenticate(req: NextRequest) {
  // For demo purposes only - in a real app, implement proper authentication
  const auth = req.headers.get('authorization')
  // This is a simple placeholder for demo purposes
  return true
}

export async function POST(req: NextRequest) {
  // Check authentication
  if (!authenticate(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { title, content, description, date, tags, slug } = body

    if (!title || !content || !slug) {
      return NextResponse.json({ error: 'Title, content, and slug are required' }, { status: 400 })
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

    // Write to file
    const filePath = path.join(postsDirectory, `${slug}.md`)
    fs.writeFileSync(filePath, markdown)

    return NextResponse.json({ success: true, slug })
  } catch (error) {
    console.error('Error creating blog post:', error)
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 })
  }
}