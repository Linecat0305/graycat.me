"use client"

import { motion } from "framer-motion"
import { useTheme } from "./theme-provider"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { FaMoon, FaSun, FaUser, FaBlog } from "react-icons/fa"
import AuthNavigation from "./AuthNavigation"

export default function BlogNavButton() {
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const isBlogPage = pathname.startsWith("/blog")

  return (
    <div className="fixed top-4 right-4 flex flex-col gap-3 z-50">
      {/* Navigation Toggle */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-full shadow-lg p-1 flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Link
          href="/"
          className={`p-2 md:p-3 rounded-full flex items-center justify-center transition-colors ${
            !isBlogPage 
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white" 
              : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          <FaUser className="text-lg" />
          <span className={`ml-2 ${!isBlogPage ? "" : "hidden md:inline"}`}>個人資料</span>
        </Link>
        
        <Link
          href="/blog"
          className={`p-2 md:p-3 rounded-full flex items-center justify-center transition-colors ${
            isBlogPage 
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white" 
              : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          <FaBlog className="text-lg" />
          <span className={`ml-2 ${isBlogPage ? "" : "hidden md:inline"}`}>部落格</span>
        </Link>
      </motion.div>

      {/* Authentication Component */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-full shadow-lg p-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <AuthNavigation />
      </motion.div>

      {/* Theme Toggle Button */}
      <motion.button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="self-end p-2 md:p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg text-gray-800 dark:text-white"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {theme === "dark" ? (
          <motion.div 
            initial={{ rotate: -45 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FaSun className="text-yellow-500 text-lg" />
          </motion.div>
        ) : (
          <motion.div 
            initial={{ rotate: 45 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FaMoon className="text-blue-700 text-lg" />
          </motion.div>
        )}
      </motion.button>
    </div>
  )
}