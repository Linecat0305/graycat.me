import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// 獲取文章的點讚數
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    // 獲取文章點讚數量
    const count = await prisma.like.count({
      where: {
        postSlug: slug,
      },
    });
    
    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error fetching like count:", error);
    return NextResponse.json(
      { message: "Something went wrong", count: 0 },
      { status: 500 }
    );
  }
}