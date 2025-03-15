import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

// 檢查當前用戶是否已對文章按讚
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    // 獲取用戶會話
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ liked: false });
    }
    
    const userId = session.user.id;
    const { slug } = params;
    
    // 檢查用戶是否已點讚該文章
    const like = await prisma.like.findFirst({
      where: {
        postSlug: slug,
        userId,
      },
    });
    
    return NextResponse.json({ liked: !!like });
  } catch (error) {
    console.error("Error checking user like status:", error);
    return NextResponse.json(
      { message: "Something went wrong", liked: false },
      { status: 500 }
    );
  }
}