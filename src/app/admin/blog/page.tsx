"use client"

import { useState, useEffect, FormEvent } from 'react'
import { BlogPost } from '@/lib/blog'
import { FaEdit, FaTrash, FaPlus, FaSave } from 'react-icons/fa'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function BlogAdmin() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [newPost, setNewPost] = useState<Partial<BlogPost>>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    content: '',
    tags: []
  })
  const [newTag, setNewTag] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Check for authentication in localStorage on component mount
    const authStatus = localStorage.getItem('adminAuthenticated')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
    }
  }, [])
  
  useEffect(() => {
    // Only load posts if authenticated
    if (isAuthenticated) {
      loadPosts()
    }
  }, [isAuthenticated])

  const loadPosts = async () => {
    try {
      const response = await fetch('/api/blog/posts')
      if (response.ok) {
        const data = await response.json()
        setPosts(data)
      } else {
        setError('Failed to fetch posts')
      }
    } catch (err) {
      setError('Error loading posts')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAuthenticate = (e: FormEvent) => {
    e.preventDefault()
    // This is a simple authentication for demo purposes
    // In a real app, use proper authentication
    if (password === 'admin123') { // This should be environment variable or proper auth
      setIsAuthenticated(true)
      localStorage.setItem('adminAuthenticated', 'true')
      setError('')
    } else {
      setError('Invalid password')
    }
  }

  const handleCreatePost = async () => {
    if (!newPost.title || !newPost.content) {
      setError('Title and content are required')
      return
    }

    try {
      const slug = newPost.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim()

      const postData = {
        ...newPost,
        slug,
        tags: newPost.tags || []
      }

      const response = await fetch('/api/admin/blog/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      })

      if (response.ok) {
        // Reset form and reload posts
        setNewPost({
          title: '',
          date: new Date().toISOString().split('T')[0],
          description: '',
          content: '',
          tags: []
        })
        setIsCreating(false)
        await loadPosts()
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to create post')
      }
    } catch (err) {
      setError('Error creating post')
      console.error(err)
    }
  }

  const handleUpdatePost = async () => {
    if (!editingPost) return

    try {
      const response = await fetch(`/api/admin/blog/posts/${editingPost.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editingPost)
      })

      if (response.ok) {
        setEditingPost(null)
        await loadPosts()
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to update post')
      }
    } catch (err) {
      setError('Error updating post')
      console.error(err)
    }
  }

  const handleDeletePost = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      const response = await fetch(`/api/admin/blog/posts/${slug}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await loadPosts()
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to delete post')
      }
    } catch (err) {
      setError('Error deleting post')
      console.error(err)
    }
  }

  const addTag = () => {
    if (!newTag.trim()) return
    
    if (editingPost) {
      setEditingPost({
        ...editingPost,
        tags: [...(editingPost.tags || []), newTag.trim()]
      })
    } else {
      setNewPost({
        ...newPost,
        tags: [...(newPost.tags || []), newTag.trim()]
      })
    }
    
    setNewTag('')
  }

  const removeTag = (tag: string) => {
    if (editingPost) {
      setEditingPost({
        ...editingPost,
        tags: editingPost.tags?.filter(t => t !== tag) || []
      })
    } else {
      setNewPost({
        ...newPost,
        tags: newPost.tags?.filter(t => t !== tag) || []
      })
    }
  }

  // If not authenticated, redirect to the main admin page
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
        >
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Redirecting...</h1>
          
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Please authenticate from the main admin dashboard.
          </p>
          
          <div className="mt-4 text-center">
            <Link href="/admin" className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors inline-block">
              Go to Admin Dashboard
            </Link>
          </div>
          
          <div className="mt-4 text-center">
            <Link href="/" className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-300">
              Back to Homepage
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Blog Administration</h1>
          <div className="flex gap-2 flex-wrap justify-end">
            <Link
              href="/blog"
              className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              View Blog
            </Link>
            <Link
              href="/admin"
              className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Admin
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem('adminAuthenticated')
                setIsAuthenticated(false)
              }}
              className="bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-800/40 text-red-700 dark:text-red-300 px-4 py-2 rounded-lg transition-colors flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
              </svg>
              Logout
            </button>
            <Link
              href="/"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Portfolio
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Posts</h2>
            <button
              onClick={() => setIsCreating(!isCreating)}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {isCreating ? 'Cancel' : 'Add New Post'} {!isCreating && <FaPlus />}
            </button>
          </div>

          {isLoading ? (
            <p className="text-gray-600 dark:text-gray-300">Loading posts...</p>
          ) : posts.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">No posts found.</p>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.slug}
                  className="border dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-750"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 dark:text-white">{post.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(post.date).toLocaleDateString()}</p>
                      <p className="text-gray-600 dark:text-gray-300 mt-2">{post.description}</p>
                      
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {post.tags.map((tag) => (
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
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingPost(post)}
                        className="p-2 text-blue-500 hover:text-blue-700 dark:hover:text-blue-300"
                        aria-label="Edit post"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.slug)}
                        className="p-2 text-red-500 hover:text-red-700 dark:hover:text-red-300"
                        aria-label="Delete post"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Post Editor - Create new post or edit existing post */}
        {(isCreating || editingPost) && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
              {editingPost ? 'Edit Post' : 'Create New Post'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={editingPost ? editingPost.title : newPost.title}
                  onChange={(e) => editingPost 
                    ? setEditingPost({ ...editingPost, title: e.target.value })
                    : setNewPost({ ...newPost, title: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  value={editingPost ? editingPost.date.substring(0, 10) : newPost.date}
                  onChange={(e) => editingPost 
                    ? setEditingPost({ ...editingPost, date: e.target.value })
                    : setNewPost({ ...newPost, date: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  id="description"
                  value={editingPost ? editingPost.description : newPost.description}
                  onChange={(e) => editingPost 
                    ? setEditingPost({ ...editingPost, description: e.target.value })
                    : setNewPost({ ...newPost, description: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag"
                    className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Add
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {(editingPost ? editingPost.tags : newPost.tags)?.map((tag) => (
                    <div
                      key={tag}
                      className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-800 dark:text-blue-100"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-blue-800 dark:text-blue-100 hover:text-blue-600 dark:hover:text-blue-300"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Content (Markdown)
                </label>
                <textarea
                  id="content"
                  value={editingPost ? editingPost.content : newPost.content}
                  onChange={(e) => editingPost 
                    ? setEditingPost({ ...editingPost, content: e.target.value })
                    : setNewPost({ ...newPost, content: e.target.value })
                  }
                  rows={15}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white font-mono"
                  required
                />
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setEditingPost(null)
                    setIsCreating(false)
                  }}
                  className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={editingPost ? handleUpdatePost : handleCreatePost}
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <FaSave /> {editingPost ? 'Update Post' : 'Create Post'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}