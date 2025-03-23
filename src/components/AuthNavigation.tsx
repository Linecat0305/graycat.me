"use client";

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus } from "react-icons/fa";

export default function AuthNavigation() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  return (
    <div className="relative">
      {status === "loading" ? (
        <div className="h-8 w-8 animate-pulse rounded-full bg-gray-300 dark:bg-gray-700"></div>
      ) : session?.user ? (
        <>
          <button
            onClick={toggleDropdown}
            className="flex items-center space-x-2 p-2 md:p-3 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {session.user.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || "User"}
                className="h-8 w-8 rounded-full"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                <FaUser />
              </div>
            )}
            <span className="text-sm font-medium">{session.user.name}</span>
          </button>

          {isOpen && (
            <div 
              className="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-gray-800 rounded-md shadow-xl z-50"
              onBlur={closeDropdown}
            >
              <Link 
                href="/profile" 
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                onClick={closeDropdown}
              >
                <FaUser className="mr-2" />
                個人檔案
              </Link>
              <button
                onClick={() => {
                  signOut({ callbackUrl: "/blog" });
                  closeDropdown();
                }}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
              >
                <FaSignOutAlt className="mr-2" />
                登出
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="flex">
          <Link
            href="/login"
            className="p-2 md:p-3 rounded-full flex items-center justify-center transition-colors bg-gradient-to-r from-blue-500 to-purple-600 text-white"
          >
            <FaSignInAlt className="text-lg" />
            <span className="ml-2">登入</span>
          </Link>
          <Link
            href="/register"
            className="p-2 md:p-3 rounded-full flex items-center justify-center transition-colors bg-gradient-to-r from-blue-500 to-purple-600 text-white"
          >
            <FaUserPlus className="text-lg" />
            <span className="ml-2">註冊</span>
          </Link>
        </div>
      )}
    </div>
  );
}