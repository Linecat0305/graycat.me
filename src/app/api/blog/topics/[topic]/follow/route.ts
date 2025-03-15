import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

// 追蹤或取消追蹤主題
export async function POST(
  request: Request,
  { params }: { params: { topic: string } }
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
    
    const userId = session.user.id;
    const { topic } = params;
    const decodedTopic = decodeURIComponent(topic);
    
    // 檢查用戶是否已追蹤該主題
    const existingFollow = await prisma.favoriteTopic.findFirst({
      where: {
        topic: decodedTopic,
        userId,
      },
    });
    
    if (existingFollow) {
      // 如果已追蹤，則取消
      await prisma.favoriteTopic.delete({
        where: {
          id: existingFollow.id,
        },
      });
      
      return NextResponse.json({ following: false });
    } else {
      // 如果未追蹤，則新增
      await prisma.favoriteTopic.create({
        data: {
          topic: decodedTopic,
          userId,
        },
      });
      
      return NextResponse.json({ following: true });
    }
  } catch (error) {
    console.error("Error toggling topic follow:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}