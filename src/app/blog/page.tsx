"use client"

import BlogNavButton from "@/components/BlogNavButton"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { BlogPost, getAllPosts } from "@/lib/blog"
import { BlogCard } from "@/components/ui/blog-card"
import { FaSearch } from "react-icons/fa"

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  
  useEffect(() => {
    // Fetch posts on client side since we can't use the server-side function directly
    fetch('/api/blog/posts')
      .then(res => res.json())
      .then(data => {
        setPosts(data)
        setFilteredPosts(data)
      })
      .catch(error => {
        console.error("Failed to fetch blog posts:", error)
        setPosts([])
        setFilteredPosts([])
      })
  }, [])
  
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPosts(posts)
      return
    }
    
    const query = searchQuery.toLowerCase()
    const filtered = posts.filter(post => 
      post.title.toLowerCase().includes(query) ||
      post.description.toLowerCase().includes(query) ||
      post.tags.some(tag => tag.toLowerCase().includes(query))
    )
    setFilteredPosts(filtered)
  }, [searchQuery, posts])
  
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
        <div className="w-full max-w-4xl mx-auto">
          <header className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient animate-gradient bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500">
              GrayCat 部落格
            </h1>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg mb-8">
              分享技術、心得和學習筆記
            </p>
            
            <div className="relative max-w-xl mx-auto">
              <input
                type="text"
                placeholder="搜尋文章..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 pl-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
            </div>
          </header>
          
          <section className="space-y-8">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-600 dark:text-gray-300 text-lg">還沒有文章或找不到符合條件的文章</p>
              </div>
            ) : (
              filteredPosts.map((post, index) => (
                <BlogCard key={post.slug} post={post} index={index} />
              ))
            )}
          </section>
        </div>
        
        <footer className="mt-20 py-8 border-t border-gray-200 dark:border-gray-700">
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