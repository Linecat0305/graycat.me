"use client"

import BlogNavButton from "@/components/BlogNavButton"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { BlogPost, getAllPosts } from "@/lib/blog"
import { BlogCard } from "@/components/ui/blog-card"
import { FaSearch, FaTag, FaTimes } from "react-icons/fa"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function BlogPageContent() {
  const searchParams = useSearchParams()
  const tagParam = searchParams.get('tag')
  
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [allTags, setAllTags] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>(tagParam ? [tagParam] : [])
  const [themes, setThemes] = useState<string[]>([
    "全部", "Web開發", "機器人", "專案分享", "學習筆記", "技術趨勢"
  ])
  const [selectedTheme, setSelectedTheme] = useState<string>("全部")
  
  useEffect(() => {
    // Fetch posts on client side since we can't use the server-side function directly
    fetch('/api/blog/posts')
      .then(res => res.json())
      .then(data => {
        setPosts(data)
        setFilteredPosts(data)
        
        // Extract all unique tags
        const tags = Array.from(new Set(
          data.flatMap((post: BlogPost) => post.tags || [])
        )).sort() as string[]
        setAllTags(tags)
      })
      .catch(error => {
        console.error("Failed to fetch blog posts:", error)
        setPosts([])
        setFilteredPosts([])
      })
  }, [])
  
  useEffect(() => {
    let filtered = [...posts]
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.description.toLowerCase().includes(query) ||
        (post.tags && post.tags.some(tag => tag.toLowerCase().includes(query)))
      )
    }
    
    // Apply tag filters
    if (selectedTags.length > 0) {
      filtered = filtered.filter(post => 
        selectedTags.some(tag => post.tags && post.tags.includes(tag))
      )
    }
    
    // Apply theme filter
    if (selectedTheme !== "全部") {
      // Match posts that have the theme in their tags
      filtered = filtered.filter(post => {
        if (!post.tags) return false;
        
        // Check by theme
        switch (selectedTheme) {
          case "Web開發":
            return post.tags.some(tag => ["web開發", "前端", "next.js", "react", "tailwindcss"].includes(tag.toLowerCase()));
          case "機器人":
            return post.tags.some(tag => ["機器人", "frc", "控制系統"].includes(tag.toLowerCase()));
          case "專案分享":
            return post.tags.some(tag => ["專案", "專案分享", "作品集"].includes(tag.toLowerCase()));
          case "學習筆記":
            return post.tags.some(tag => ["學習筆記", "筆記", "教學"].includes(tag.toLowerCase()));
          case "技術趨勢":
            return post.tags.some(tag => ["技術趨勢", "趨勢", "分析"].includes(tag.toLowerCase()));
          default:
            return false;
        }
      });
    }
    
    setFilteredPosts(filtered)
  }, [searchQuery, posts, selectedTags, selectedTheme])
  
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
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
        <div className="w-full mx-auto">
          <header className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient animate-gradient bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500">
              GrayCat Blog
            </h1>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg mb-6">
              分享技術、心得和學習筆記
            </p>
            
            <div className="relative max-w-xl mx-auto mb-8">
              <input
                type="text"
                placeholder="搜尋文章..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 pl-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
            </div>
            
            {/* Theme Filter */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {themes.map(theme => (
                <button
                  key={theme}
                  onClick={() => setSelectedTheme(theme)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedTheme === theme
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  {theme}
                </button>
              ))}
            </div>
          </header>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Posts Section - Left Side */}
            <section className="md:w-2/3 space-y-8">
              {filteredPosts.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-gray-600 dark:text-gray-300 text-lg">還沒有文章或找不到符合條件的文章</p>
                </div>
              ) : (
                filteredPosts.map((post, index) => (
                  <BlogCard 
                    key={post.slug} 
                    post={post} 
                    index={index} 
                  />
                ))
              )}
            </section>
            
            {/* Tags Section - Right Side */}
            <aside className="md:w-1/3">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md sticky top-24">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                  <FaTag className="mr-2 text-blue-500" />
                  文章標籤
                </h3>
                
                {selectedTags.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">已選擇：</span>
                      <button 
                        onClick={() => setSelectedTags([])}
                        className="ml-2 text-xs text-blue-500 hover:text-blue-700 dark:hover:text-blue-300"
                      >
                        清除全部
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedTags.map(tag => (
                        <span 
                          key={tag} 
                          className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full flex items-center"
                        >
                          {tag}
                          <button 
                            onClick={() => toggleTag(tag)} 
                            className="ml-1 text-blue-500 hover:text-blue-700 dark:hover:text-blue-300"
                          >
                            <FaTimes size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-xs transition-colors ${
                        selectedTags.includes(tag)
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          </div>
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

export default function BlogPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BlogPageContent />
    </Suspense>
  )
}