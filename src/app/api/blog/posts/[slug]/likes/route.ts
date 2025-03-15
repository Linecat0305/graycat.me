import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

// 按讚或取消按讚文章
export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    // 確保用戶已登入
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const { slug } = params;
    
    // 嘗試從請求體中獲取用戶 ID
    let userData = {};
    try {
      userData = await request.json();
    } catch (e) {
      // 忽略 JSON 解析錯誤
    }
    
    // 首先使用請求體中的 userId（如果存在），否則使用 session.user.id
    const userId = userData.userId || session.user.id;
    
    console.log(`Like action: User ${userId} for post ${slug}`);
    console.log(`Session user ID: ${session.user.id}, Request user ID: ${userData.userId || 'not provided'}`);
    
    // 檢查用戶是否已點讚該文章
    const existingLike = await prisma.like.findFirst({
      where: {
        postSlug: slug,
        userId,
      },
    });
    
    if (existingLike) {
      // 如果已點讚，則取消
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
      
      return NextResponse.json({ liked: false });
    } else {
      // 如果未點讚，則新增
      const newLike = await prisma.like.create({
        data: {
          postSlug: slug,
          userId,
        },
      });
      
      console.log("Created new like record:", newLike);
      
      // 驗證記錄是否成功創建
      const verifyLike = await prisma.like.findFirst({
        where: {
          postSlug: slug,
          userId,
        },
      });
      
      console.log("Verification - like record exists:", !!verifyLike);
      
      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}