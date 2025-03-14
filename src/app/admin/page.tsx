"use client"

import { useState, useEffect, FormEvent } from 'react'
import { FaBlog, FaUserCircle, FaLock } from 'react-icons/fa'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  // Check for authentication in localStorage on component mount
  useEffect(() => {
    const authStatus = localStorage.getItem('adminAuthenticated')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
    }
  }, [])
  const [error, setError] = useState('')
  const router = useRouter()

  const handleAuthenticate = (e: FormEvent) => {
    e.preventDefault()
    // This is a simple authentication for demo purposes
    // In a real app, use proper authentication
    if (password === 'admin123') { // This should be environment variable or proper auth
      // Set authenticated state and store in localStorage
      setIsAuthenticated(true)
      localStorage.setItem('adminAuthenticated', 'true')
      setError('')
    } else {
      setError('Invalid password')
    }
  }

  // If not authenticated, show login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50 dark:from-blue-900/5 to-transparent z-0 opacity-50"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <FaLock className="text-2xl text-white" />
              </div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                Admin Login
              </h1>
            </div>
            
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 p-4 rounded-xl mb-6 shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              </motion.div>
            )}
            
            <form onSubmit={handleAuthenticate} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Admin Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 pl-12 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition-all duration-200 shadow-sm"
                    required
                    placeholder="Enter password"
                  />
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg flex justify-center items-center gap-2"
              >
                <span>Login to Dashboard</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                </svg>
              </button>
            </form>
            
            <div className="mt-8 text-center">
              <Link 
                href="/" 
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Portfolio
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Administration Dashboard</h1>
          <div className="flex gap-4">
            <button
              onClick={() => {
                localStorage.removeItem('adminAuthenticated')
                setIsAuthenticated(false)
              }}
              className="relative overflow-hidden bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-6 py-2 rounded-lg group transition-all duration-300 ease-out hover:shadow-lg"
            >
              <span className="relative flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                </svg>
                Logout
              </span>
            </button>
            <Link
              href="/"
              className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg group transition-all duration-300 ease-out hover:shadow-lg"
            >
              <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"></span>
              <span className="relative">Back to Portfolio</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Blog Management Card */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 border border-transparent hover:border-blue-500/30"
          >
            <div 
              className="p-8 cursor-pointer relative overflow-hidden"
              onClick={() => router.push('/admin/blog')}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="flex items-center mb-6 relative">
                <div className="p-3 bg-blue-500/10 rounded-lg mr-4 group-hover:scale-110 transition-transform duration-300">
                  <FaBlog className="text-4xl text-blue-500 group-hover:text-blue-600 transition-colors" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">Blog Management</h2>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6 relative">
                Create, edit, and delete blog posts. Manage your blog content and keep your audience engaged with fresh content.
              </p>
              
              <div className="flex justify-end relative">
                <Link 
                  href="/admin/blog"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transform transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1"
                >
                  Manage Blog
                  <span className="transform transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Portfolio Management Card */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 border border-transparent hover:border-purple-500/30"
          >
            <div 
              className="p-8 cursor-pointer relative overflow-hidden"
              onClick={() => router.push('/admin/portfolio')}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="flex items-center mb-6 relative">
                <div className="p-3 bg-purple-500/10 rounded-lg mr-4 group-hover:scale-110 transition-transform duration-300">
                  <FaUserCircle className="text-4xl text-purple-500 group-hover:text-purple-600 transition-colors" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors">Portfolio Management</h2>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6 relative">
                Update your projects, skills, experiences, and education information. Keep your portfolio current and showcase your latest achievements.
              </p>
              
              <div className="flex justify-end relative">
                <Link 
                  href="/admin/portfolio"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg transform transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1"
                >
                  Manage Portfolio
                  <span className="transform transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}