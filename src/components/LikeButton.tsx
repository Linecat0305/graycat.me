"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import Link from "next/link";

interface LikeButtonProps {
  postSlug: string;
}

export default function LikeButton({ postSlug }: LikeButtonProps) {
  const { data: session, status } = useSession();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        // 獲取該文章的按讚總數
        const countResponse = await fetch(`/api/blog/posts/${postSlug}/likes/count`);
        const countData = await countResponse.json();
        setLikesCount(countData.count);

        // 如果用戶已登入，檢查是否已按讚
        if (session?.user) {
          const userLikeResponse = await fetch(`/api/blog/posts/${postSlug}/likes/user`);
          const userLikeData = await userLikeResponse.json();
          setLiked(!!userLikeData.liked);
        }
      } catch (error) {
        console.error("Error fetching likes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (status !== "loading") {
      fetchLikes();
    }
  }, [postSlug, session, status]);

  const handleLike = async () => {
    if (!session) {
      // 如果未登入，導向登入頁面
      return;
    }

    try {
      const response = await fetch(`/api/blog/posts/${postSlug}/likes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // 傳遞 userId 以確保在 API 端能獲取正確的用戶 ID
        body: JSON.stringify({
          userId: session.user.id,
        }),
      });

      if (response.ok) {
        const newLiked = !liked;
        setLiked(newLiked);
        setLikesCount(prevCount => newLiked ? prevCount + 1 : prevCount - 1);
      }
    } catch (error) {
      // Handle errors silently
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center space-x-1">
        <div className="w-5 h-5 animate-pulse bg-gray-300 dark:bg-gray-700 rounded-full"></div>
        <span className="text-gray-500 dark:text-gray-400 text-sm">...</span>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center space-x-1">
        <Link
          href={`/login?callbackUrl=/blog/${postSlug}`}
          className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
        >
          <FaRegHeart className="text-xl" />
        </Link>
        <span className="text-gray-500 dark:text-gray-400 text-sm">{likesCount}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-1">
      <button
        onClick={handleLike}
        className={`${
          liked ? "text-red-500 dark:text-red-400" : "text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400"
        } transition-colors focus:outline-none`}
        aria-label={liked ? "Unlike post" : "Like post"}
      >
        {liked ? <FaHeart className="text-xl" /> : <FaRegHeart className="text-xl" />}
      </button>
      <span className="text-gray-500 dark:text-gray-400 text-sm">{likesCount}</span>
    </div>
  );
}