import { NextResponse } from 'next/server'
import { getPostBySlug } from '@/lib/blog'

export function GET(
  request: Request
) {
  // Extract slug from URL
  const url = new URL(request.url)
  const pathParts = url.pathname.split('/')
  const slug = pathParts[pathParts.length - 1]
  
  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
  }

  // Get the blog post by its slug
  const post = getPostBySlug(slug)
  
  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }
  
  return NextResponse.json(post)
}