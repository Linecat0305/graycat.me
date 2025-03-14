"use client"

import { useParams } from "next/navigation"
import BlogPostContent from "./PostContent"

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string
  
  return <BlogPostContent slug={slug} />
}