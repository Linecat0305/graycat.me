import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

// 檢查用戶是否已追蹤主題
export async function GET(
  request: Request,
  { params }: { params: { topic: string } }
) {
  try {
    // 獲取用戶會話
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ following: false });
    }
    
    const userId = session.user.id;
    const { topic } = params;
    const decodedTopic = decodeURIComponent(topic);
    
    // 檢查用戶是否已追蹤該主題
    const favoriteExists = await prisma.favoriteTopic.findFirst({
      where: {
        topic: decodedTopic,
        userId,
      },
    });
    
    return NextResponse.json({ following: !!favoriteExists });
  } catch (error) {
    console.error("Error checking topic follow status:", error);
    return NextResponse.json(
      { message: "Something went wrong", following: false },
      { status: 500 }
    );
  }
}