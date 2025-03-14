"use client"

import BlogNavButton from "@/components/BlogNavButton"
import { motion } from "framer-motion"
import { useEffect, useState, use } from "react"
import { BlogPost } from "@/lib/blog"
import { FaCalendarAlt, FaTag, FaArrowLeft } from "react-icons/fa"
import Link from "next/link"
import { MDXRemote } from "next-mdx-remote"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import remarkGfm from "remark-gfm"
import { serialize } from "next-mdx-remote/serialize"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  // Unwrap params using React.use()
  const resolvedParams = use(params as any)
  const slug = resolvedParams.slug
  
  const [post, setPost] = useState<BlogPost | null>(null)
  const [mdxSource, setMdxSource] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    // Fetch specific post
    fetch(`/api/blog/posts/${slug}`)
      .then(res => res.json())
      .then(async (data) => {
        setPost(data)
        
        if (data) {
          const mdxSource = await serialize(data.content, {
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
              format: 'mdx'
            },
            parseFrontmatter: true
          })
          setMdxSource(mdxSource)
        }
        
        setIsLoading(false)
      })
      .catch(error => {
        console.error("Failed to fetch blog post:", error)
        setPost(null)
        setIsLoading(false)
      })
  }, [slug])
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-blue-500 text-2xl">正在加載文章...</div>
      </div>
    )
  }
  
  if (!post) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">找不到此文章</h1>
        <Link href="/blog" className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-2">
          <FaArrowLeft />
          <span>返回部落格首頁</span>
        </Link>
      </div>
    )
  }
  
  return (
    <motion.main 
      className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <BlogNavButton />
      
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="container mx-auto px-4 md:px-12 lg:px-24 py-6 md:py-10"
      >
        <div className="w-full max-w-3xl mx-auto">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 mb-8"
          >
            <FaArrowLeft />
            <span>返回部落格首頁</span>
          </Link>
          
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-white">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <div className="flex items-center gap-1">
                <FaCalendarAlt className="text-blue-500" />
                <span>{formatDate(post.date)}</span>
              </div>
              
              {post.tags && post.tags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <FaTag className="text-blue-500" />
                  {post.tags.map(tag => (
                    <span 
                      key={tag}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-xs rounded-full text-blue-800 dark:text-blue-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </header>
          
          <article className="prose prose-blue max-w-none dark:prose-invert prose-a:text-blue-500 prose-headings:text-gray-800 dark:prose-headings:text-white prose-img:rounded-lg prose-img:shadow-md">
            {mdxSource && <MDXRemote {...mdxSource} />}
          </article>
        </div>
        
        <footer className="mt-20 py-8 border-t border-gray-200 dark:border-gray-700 w-full max-w-3xl mx-auto">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              © {new Date().getFullYear()} GrayCat. All rights reserved.
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-xs mt-2">
              Built with Next.js, TailwindCSS, and Framer Motion
            </p>
          </div>
        </footer>
      </motion.div>
    </motion.main>
  )
}