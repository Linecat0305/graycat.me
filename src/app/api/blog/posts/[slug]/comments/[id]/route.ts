import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

// 更新評論
export async function PUT(
  request: Request,
  { params }: { params: { slug: string; id: string } }
) {
  try {
    const { id } = params;
    const { content } = await request.json();
    
    // 確保用戶已登入
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // 查找評論
    const comment = await prisma.comment.findUnique({
      where: { id },
    });
    
    if (!comment) {
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 }
      );
    }
    
    // 確保該評論屬於當前用戶
    if (comment.userId !== session.user.id) {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }
    
    // 更新評論
    const updatedComment = await prisma.comment.update({
      where: { id },
      data: { content },
    });
    
    return NextResponse.json(updatedComment);
  } catch (error) {
    console.error("Error updating comment:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

// 刪除評論
export async function DELETE(
  request: Request,
  { params }: { params: { slug: string; id: string } }
) {
  try {
    const { id } = params;
    
    // 確保用戶已登入
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // 查找評論
    const comment = await prisma.comment.findUnique({
      where: { id },
    });
    
    if (!comment) {
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 }
      );
    }
    
    // 確保該評論屬於當前用戶
    if (comment.userId !== session.user.id) {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }
    
    // 刪除評論
    await prisma.comment.delete({
      where: { id },
    });
    
    return NextResponse.json({ message: "Comment deleted" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}