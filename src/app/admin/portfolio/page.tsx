"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import PortfolioManager from './components/PortfolioManager';

export default function PortfolioAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');

  // Check authentication status on load
  useEffect(() => {
    const authStatus = localStorage.getItem('adminAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Handle login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuthenticated', 'true');
      setError('');
    } else {
      setError('Invalid password');
    }
  };

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Portfolio Admin Login</h1>
          
          {error && (
            <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin}>
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
            <Link href="/admin" className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-300">
              Back to Admin Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Main admin interface
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            Portfolio Administration
          </h1>
          <div className="flex gap-3">
            <Link
              href="/admin"
              className="flex items-center gap-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 px-5 py-2.5 rounded-xl transition-all duration-300 shadow-sm hover:shadow border border-gray-200 dark:border-gray-700 group"
            >
              <FaArrowLeft className="text-blue-500" /> 
              <span>Back to Admin</span>
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem('adminAuthenticated');
                setIsAuthenticated(false);
              }}
              className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-5 py-2.5 rounded-xl transition-all duration-300 shadow-sm hover:shadow border border-red-100 dark:border-red-800/30 hover:bg-red-100 dark:hover:bg-red-800/30"
            >
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Portfolio Manager Component */}
        <PortfolioManager />
      </div>
    </div>
  );
}