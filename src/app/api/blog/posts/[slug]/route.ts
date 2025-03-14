import { NextRequest, NextResponse } from 'next/server'
import { getPostBySlug } from '@/lib/blog'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  // Safely access params
  const slug = params?.slug
  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
  }

  const post = getPostBySlug(slug)
  
  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }
  
  return NextResponse.json(post)
}