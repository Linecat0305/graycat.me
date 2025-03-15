import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

// 獲取用戶追蹤的所有主題
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
    
    // 獲取用戶的追蹤主題
    const topics = await prisma.favoriteTopic.findMany({
      where: {
        userId,
      },
      orderBy: {
        topic: "asc", // 按主題名稱排序
      },
    });
    
    return NextResponse.json(topics || []);
  } catch (error) {
    console.error("Error fetching user favorite topics:", error);
    return NextResponse.json(
      [],
      { status: 200 }
    );
  }
}