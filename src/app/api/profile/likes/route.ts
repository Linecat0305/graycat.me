import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { getPostBySlug } from "@/lib/blog";

// 獲取用戶按讚的所有文章
export async function GET(request: Request) {
  try {
    // 確保用戶已登入
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // 從查詢參數中獲取用戶 ID，如果沒有則使用會話中的用戶 ID
    const url = new URL(request.url);
    const urlUserId = url.searchParams.get('userId');
    const userId = urlUserId || session.user.id;
    
    // 獲取用戶的點讚記錄
    const likes = await prisma.like.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    
    try {
      // 為每個點讚記錄添加文章標題
      const enrichedLikes = await Promise.all(
        likes.map(async (like) => {
          const post = getPostBySlug(like.postSlug);
          return {
            ...like,
            post: post ? { title: post.title } : undefined,
          };
        })
      );
      
      return NextResponse.json(enrichedLikes || []);
    } catch (enrichError) {
      console.error("Error enriching likes data:", enrichError);
      // 如果資料處理過程出錯，至少返回原始 likes 資料
      return NextResponse.json(likes || []);
    }
  } catch (error) {
    console.error("Error fetching user likes:", error);
    return NextResponse.json(
      [],
      { status: 200 }
    );
  }
}