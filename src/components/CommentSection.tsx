"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FaUser, FaPaperPlane, FaSpinner, FaEdit, FaTrash, FaTimes, FaSave } from "react-icons/fa";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { zhTW } from "date-fns/locale";

interface Comment {
  id: string;
  content: string;
  userId: string | null;
  authorName: string | null;
  ipAddress: string | null;
  createdAt: string;
  user?: {
    name: string | null;
    image: string | null;
  };
}

interface CommentSectionProps {
  postSlug: string;
}

export default function CommentSection({ postSlug }: CommentSectionProps) {
  const { data: session, status } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    fetchComments();
  }, [postSlug]);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/blog/posts/${postSlug}/comments`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }
      
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setError("無法載入評論");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentText.trim()) return;
    
    try {
      setSubmitting(true);
      setError("");
      
      const response = await fetch(`/api/blog/posts/${postSlug}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: commentText }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to submit comment");
      }
      
      setCommentText("");
      fetchComments();
    } catch (error) {
      console.error("Error submitting comment:", error);
      setError("評論發佈失敗");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditComment = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditText(comment.content);
  };

  const handleUpdateComment = async (commentId: string) => {
    if (!editText.trim()) return;
    
    try {
      setSubmitting(true);
      setError("");
      
      const response = await fetch(`/api/blog/posts/${postSlug}/comments/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: editText }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update comment");
      }
      
      setEditingCommentId(null);
      fetchComments();
    } catch (error) {
      console.error("Error updating comment:", error);
      setError("更新評論失敗");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("確定要刪除此評論嗎？")) return;
    
    try {
      setError("");
      
      const response = await fetch(`/api/blog/posts/${postSlug}/comments/${commentId}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }
      
      fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
      setError("刪除評論失敗");
    }
  };

  const formatCommentTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: zhTW });
    } catch (error) {
      return "未知時間";
    }
  };

  const displayAuthor = (comment: Comment) => {
    if (comment.user && comment.user.name) {
      return comment.user.name;
    } else if (comment.authorName) {
      return comment.authorName;
    } else if (comment.ipAddress) {
      // 只顯示 IP 地址的一部分
      const ipParts = comment.ipAddress.split('.');
      return `訪客 (${ipParts[0]}.${ipParts[1]}.***.${ipParts[3]})`;
    } else {
      return "匿名";
    }
  };

  return (
    <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">評論</h3>
      
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 mb-4 rounded-lg">
          {error}
        </div>
      )}
      
      {/* 評論表單 */}
      {!session && (
        <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
          <p className="text-blue-700 dark:text-blue-300 mb-2">登入後發表評論</p>
          <Link
            href={`/login?callbackUrl=/blog/${postSlug}`}
            className="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            登入帳戶
          </Link>
        </div>
      )}
      
      {session && (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <div className="flex items-start space-x-3 mb-2">
            {session.user?.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || "User"}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-500 dark:bg-blue-600 text-white flex items-center justify-center">
                <FaUser />
              </div>
            )}
            <div className="flex-1">
              <div className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                {session.user?.name || "您"}
              </div>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="分享您的想法..."
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white min-h-[100px] focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                required
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting || !commentText.trim()}
              className="flex items-center bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 dark:disabled:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
            >
              {submitting ? (
                <FaSpinner className="animate-spin mr-2" />
              ) : (
                <FaPaperPlane className="mr-2" />
              )}
              發表評論
            </button>
          </div>
        </form>
      )}
      
      {/* 評論列表 */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <FaSpinner className="animate-spin text-2xl text-blue-500" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          目前還沒有評論，成為第一個評論的人吧！
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-200 dark:border-gray-700 pb-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {comment.user?.image ? (
                    <img
                      src={comment.user.image}
                      alt={comment.user?.name || "User"}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 text-white flex items-center justify-center">
                      <FaUser />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-medium text-gray-800 dark:text-white">
                      {displayAuthor(comment)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {formatCommentTime(comment.createdAt)}
                    </div>
                  </div>
                  
                  {editingCommentId === comment.id ? (
                    <div>
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white mb-2"
                        rows={3}
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setEditingCommentId(null)}
                          className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                        >
                          <FaTimes className="mr-1" />
                          取消
                        </button>
                        <button
                          onClick={() => handleUpdateComment(comment.id)}
                          disabled={submitting}
                          className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                        >
                          {submitting ? (
                            <FaSpinner className="animate-spin mr-1" />
                          ) : (
                            <FaSave className="mr-1" />
                          )}
                          儲存
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {comment.content}
                      </div>
                      
                      {session && comment.userId === session.user.id && (
                        <div className="flex space-x-4 mt-2">
                          <button
                            onClick={() => handleEditComment(comment)}
                            className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center"
                          >
                            <FaEdit className="mr-1" />
                            編輯
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-xs text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 flex items-center"
                          >
                            <FaTrash className="mr-1" />
                            刪除
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}