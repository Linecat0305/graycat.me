"use client"

import { BlogPost } from "@/lib/blog"
import Link from "next/link"
import { motion } from "framer-motion"
import { FaCalendarAlt, FaTag } from "react-icons/fa"

interface BlogCardProps {
  post: BlogPost
  index: number
}

export function BlogCard({ post, index }: BlogCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow border-l-4 border-blue-500"
    >
      <Link href={`/blog/${post.slug}`} className="block group">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 group-hover:text-blue-500 transition-colors">
          {post.title}
        </h2>
        
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <div className="flex items-center gap-1">
            <FaCalendarAlt className="text-blue-500" />
            <span>{formatDate(post.date)}</span>
          </div>
          
          {post.tags && post.tags.length > 0 && (
            <div className="flex items-center gap-1">
              <FaTag className="text-blue-500" />
              <span>{post.tags.join(', ')}</span>
            </div>
          )}
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
          {post.description}
        </p>
        
        <div className="text-blue-500 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
          閱讀更多 <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
        </div>
      </Link>
    </motion.div>
  )
}