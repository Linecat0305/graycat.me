"use client"

import Portfolio from "@/components/Portfolio"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <motion.main 
      className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <Portfolio />
      </motion.div>
    </motion.main>
  )
}