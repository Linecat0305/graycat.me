"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PortfolioAdminMinimal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Check for authentication
  useEffect(() => {
    const authStatus = localStorage.getItem('adminAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-6">Portfolio Admin Login</h1>
          <div className="mt-4 text-center">
            <Link href="/admin" className="text-blue-500">
              Back to Admin Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Portfolio Administration</h1>
        <div className="flex gap-3 mb-6">
          <Link href="/admin" className="px-4 py-2 bg-gray-200 rounded-lg">
            Back to Admin
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem('adminAuthenticated');
              setIsAuthenticated(false);
            }}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg"
          >
            Logout
          </button>
        </div>
        <div className="p-6 bg-white rounded-lg">
          <p>Simplified Portfolio Admin Dashboard</p>
        </div>
      </div>
    </div>
  );
}