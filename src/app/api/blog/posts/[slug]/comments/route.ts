import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

// 獲取文章評論
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    // 獲取該文章的所有評論，按時間降序排列
    const comments = await prisma.comment.findMany({
      where: {
        postSlug: slug,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    
    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

// 創建新評論
export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const { content } = await request.json();
    
    // 獲取用戶會話
    const session = await getServerSession(authOptions);
    const headersList = headers();
    const ipAddress = headersList.get("x-forwarded-for") || 
                      headersList.get("x-real-ip") || 
                      "unknown";
    
    // 準備評論數據
    const commentData: any = {
      content,
      postSlug: slug,
    };
    
    // 如果用戶已登入，關聯用戶 ID
    if (session?.user) {
      commentData.userId = session.user.id;
      commentData.authorName = session.user.name;
    } else {
      // 如果未登入，記錄訪客 IP
      commentData.ipAddress = ipAddress;
    }
    
    // 創建評論
    const comment = await prisma.comment.create({
      data: commentData,
    });
    
    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}