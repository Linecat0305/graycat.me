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

  // If not authenticated, show login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
        >
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Blog Admin Login</h1>
          
          {error && (
            <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleAuthenticate}>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Login
            </button>
          </form>
          
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
          <div className="flex gap-4">
            <Link
              href="/blog"
              className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-lg transition-colors"
            >
              View Blog
            </Link>
            <Link
              href="/"
              className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-lg transition-colors"
            >
              Back to Portfolio
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