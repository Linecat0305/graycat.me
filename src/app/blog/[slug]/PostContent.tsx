"use client"

import BlogNavButton from "@/components/BlogNavButton"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { BlogPost } from "@/lib/blog"
import { FaCalendarAlt, FaTag, FaArrowLeft } from "react-icons/fa"
import Link from "next/link"
import { MDXRemote } from "next-mdx-remote"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import remarkGfm from "remark-gfm"
import { serialize } from "next-mdx-remote/serialize"
import LikeButton from "@/components/LikeButton"
import TopicFollowButton from "@/components/TopicFollowButton"
import CommentSection from "@/components/CommentSection"

interface BlogPostContentProps {
  slug: string
}

export default function BlogPostContent({ slug }: BlogPostContentProps) {
  const [post, setPost] = useState<BlogPost | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mdxSource, setMdxSource] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        console.log(`Fetching post with slug: ${slug}`);
        
        // Try to fetch directly using the slug
        const response = await fetch(`/api/blog/posts/${slug}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        setPost(data);
        
        try {
          const mdxSource = await serialize(data.content, {
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
              format: 'mdx'
            },
            parseFrontmatter: true
          });
          setMdxSource(mdxSource);
        } catch (serializeError) {
          console.error("Failed to serialize MDX content:", serializeError);
          setError("Could not process article content");
        }
      } catch (error) {
        console.error("Failed to fetch blog post:", error);
        setError(error instanceof Error ? error.message : "Failed to load post");
        setPost(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPost();
  }, [slug]);
  
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
  
  if (error || !post) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">找不到此文章</h1>
        {error && (
          <p className="text-red-500 mb-6">{error}</p>
        )}
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

          <div className="flex justify-between items-center mt-12 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              {/* 文章互動 */}
              <div className="flex items-center">
                {/* 引入點讚按鈕 */}
                {post.slug && <LikeButton postSlug={post.slug} />}
              </div>
              
              {/* 文章標籤部分 */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <div key={tag} className="flex items-center">
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-xs rounded-full text-blue-800 dark:text-blue-100 mr-1">
                        {tag}
                      </span>
                      {/* 引入追蹤主題按鈕 */}
                      <TopicFollowButton topic={tag} />
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-sm text-blue-500 hover:text-blue-700 dark:hover:text-blue-300"
              >
                回到頂部 ↑
              </button>
            </div>
          </div>

          {/* 評論區塊 */}
          {post.slug && <CommentSection postSlug={post.slug} />}
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