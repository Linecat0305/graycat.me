"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FaStar, FaRegStar } from "react-icons/fa";
import Link from "next/link";

interface TopicFollowButtonProps {
  topic: string;
}

export default function TopicFollowButton({ topic }: TopicFollowButtonProps) {
  const { data: session, status } = useSession();
  const [following, setFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!session) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/blog/topics/${encodeURIComponent(topic)}/follow/status`);
        const data = await response.json();
        setFollowing(data.following);
      } catch (error) {
        console.error("Error checking topic follow status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (status !== "loading") {
      checkFollowStatus();
    }
  }, [topic, session, status]);

  const toggleFollow = async () => {
    if (!session) {
      return;
    }

    try {
      const response = await fetch(`/api/blog/topics/${encodeURIComponent(topic)}/follow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setFollowing(!following);
      }
    } catch (error) {
      console.error("Error toggling follow status:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="w-6 h-6 animate-pulse bg-gray-300 dark:bg-gray-700 rounded-full"></div>
    );
  }

  if (!session) {
    return (
      <Link
        href={`/login?callbackUrl=/blog?tag=${encodeURIComponent(topic)}`}
        className="text-gray-400 dark:text-gray-500 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors"
        title="登入以追蹤此主題"
      >
        <FaRegStar className="text-xl" />
      </Link>
    );
  }

  return (
    <button
      onClick={toggleFollow}
      className={`${
        following ? "text-yellow-500 dark:text-yellow-400" : "text-gray-400 dark:text-gray-500 hover:text-yellow-500 dark:hover:text-yellow-400"
      } transition-colors focus:outline-none`}
      title={following ? "取消追蹤此主題" : "追蹤此主題"}
    >
      {following ? <FaStar className="text-xl" /> : <FaRegStar className="text-xl" />}
    </button>
  );
}