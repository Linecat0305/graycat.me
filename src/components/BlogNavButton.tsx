"use client"

import { motion } from "framer-motion"
import { useTheme } from "./theme-provider"

export default function BlogNavButton() {
  const { theme, setTheme } = useTheme()

  return (
    <>
      {/* Theme Toggle Button */}
      <motion.button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="fixed top-4 right-4 p-2 md:p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg z-50 text-white"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {theme === "dark" ? (
          <motion.div 
            initial={{ rotate: -45 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.5 }}
          >
            🌞
          </motion.div>
        ) : (
          <motion.div 
            initial={{ rotate: 45 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.5 }}
          >
            🌙
          </motion.div>
        )}
      </motion.button>
      
      {/* Portfolio Navigation Button */}
      <motion.a
        href="/"
        className="fixed top-20 right-4 p-2 md:p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg z-50 text-white"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 0 }}
          transition={{ duration: 0.5 }}
        >
          👤
        </motion.div>
      </motion.a>
    </>
  )
}