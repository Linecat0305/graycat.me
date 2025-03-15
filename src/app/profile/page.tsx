"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaUser, FaHeart, FaStar, FaComment, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import BlogNavButton from "@/components/BlogNavButton";

interface LikedPost {
  postSlug: string;
  createdAt: string;
  post?: {
    title: string;
  };
}

interface FavoriteTopicItem {
  id: string;
  topic: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"likes" | "topics">("likes");
  const [likedPosts, setLikedPosts] = useState<LikedPost[]>([]);
  const [favoriteTopics, setFavoriteTopics] = useState<FavoriteTopicItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/profile");
    }

    if (status === "authenticated" && session?.user?.id) {
      fetchUserData(session.user.id);
    }
  }, [status, session]);

  const fetchUserData = async (userId: string) => {
    try {
      setIsLoading(true);
      
      try {
        // 獲取用戶按讚的文章
        const likesResponse = await fetch(`/api/profile/likes?userId=${userId}`);
        if (!likesResponse.ok) {
          setLikedPosts([]);
        } else {
          const likesData = await likesResponse.json();
          
          // 確保 likesData 是一個陣列
          if (Array.isArray(likesData)) {
            setLikedPosts(likesData);
          } else {
            setLikedPosts([]);
          }
        }
      } catch (likesError) {
        setLikedPosts([]);
      }
      
      try {
        // 獲取用戶追蹤的主題
        const topicsResponse = await fetch(`/api/profile/topics?userId=${userId}`);
        if (!topicsResponse.ok) {
          setFavoriteTopics([]);
        } else {
          const topicsData = await topicsResponse.json();
          
          // 確保 topicsData 是一個陣列
          if (Array.isArray(topicsData)) {
            setFavoriteTopics(topicsData);
          } else {
            setFavoriteTopics([]);
          }
        }
      } catch (topicsError) {
        setFavoriteTopics([]);
      }
    } catch (error) {
      // Handle general errors
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-blue-500 text-2xl">載入中...</div>
      </div>
    );
  }

  if (!session) {
    return null; // Router will redirect to login
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <BlogNavButton />
      
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <Link
              href="/blog"
              className="inline-flex items-center text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 mb-6"
            >
              <FaArrowLeft className="mr-2" />
              返回部落格
            </Link>
            
            <div className="flex items-center space-x-4 mb-6">
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || "用戶頭像"}
                  className="w-16 h-16 rounded-full"
                />
              ) : (
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl">
                  <FaUser />
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {session.user.name || "用戶"}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {session.user.email}
                </p>
              </div>
            </div>
          </div>
          
          {/* 分頁選項 */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab("likes")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "likes"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                <FaHeart className="inline mr-2" />
                已按讚文章
              </button>
              <button
                onClick={() => setActiveTab("topics")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "topics"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                <FaStar className="inline mr-2" />
                追蹤主題
              </button>
            </nav>
          </div>
          
          {/* 已按讚文章列表 */}
          {activeTab === "likes" && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">已按讚的文章</h2>
              {!Array.isArray(likedPosts) || likedPosts.length === 0 ? (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                  您尚未按讚任何文章。瀏覽部落格並按讚您喜歡的文章吧！
                </div>
              ) : (
                <div className="space-y-4">
                  {likedPosts.map((like) => (
                    like && like.postSlug ? (
                      <div
                        key={like.postSlug}
                        className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
                      >
                        <Link
                          href={`/blog/${like.postSlug}`}
                          className="text-lg font-medium text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {like.post?.title || like.postSlug}
                        </Link>
                        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          按讚於 {like.createdAt ? new Date(like.createdAt).toLocaleDateString('zh-TW') : '未知時間'}
                        </div>
                      </div>
                    ) : null
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* 追蹤主題列表 */}
          {activeTab === "topics" && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">追蹤的主題</h2>
              {!Array.isArray(favoriteTopics) || favoriteTopics.length === 0 ? (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                  您尚未追蹤任何主題。瀏覽部落格並追蹤您感興趣的主題吧！
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {favoriteTopics.map((topic) => (
                    topic && topic.id && topic.topic ? (
                      <Link
                        key={topic.id}
                        href={`/blog?tag=${encodeURIComponent(topic.topic)}`}
                        className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors"
                      >
                        <FaStar className="inline mr-1 text-yellow-500" />
                        {topic.topic}
                      </Link>
                    ) : null
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}