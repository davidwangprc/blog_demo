import prisma from "@/utils/db";
import { NextResponse } from "next/server";

// GET 获取单个书签
export async function GET(req, { params }) {
  try {
    const bookmark = await prisma.bookmark.findUnique({
      where: {
        id: parseInt(params.id)
      },
      include: {
        category: true,
        tags: true
      }
    });

    if (!bookmark) {
      return NextResponse.json(
        { message: "书签不存在" },
        { status: 404 }
      );
    }

    return NextResponse.json(bookmark);
  } catch (error) {
    console.error("获取书签详情失败:", error);
    return NextResponse.json(
      { message: "获取书签详情失败" },
      { status: 500 }
    );
  }
}

// PUT 更新书签
export async function PUT(req, { params }) {
  try {
    const body = await req.json();
    const { title, url, description, icon, screenshot, categoryId, tags } = body;

    const bookmark = await prisma.bookmark.update({
      where: {
        id: parseInt(params.id)
      },
      data: {
        title,
        url,
        description,
        icon,
        screenshot,
        categoryId: parseInt(categoryId),
        tags: {
          set: tags.map(tagId => ({ id: tagId }))
        }
      },
      include: {
        category: true,
        tags: true
      }
    });

    return NextResponse.json(bookmark);
  } catch (error) {
    console.error("更新书签失败:", error);
    return NextResponse.json(
      { message: "更新书签失败" },
      { status: 500 }
    );
  }
}

// DELETE 删除书签
export async function DELETE(req, { params }) {
  try {
    await prisma.bookmark.delete({
      where: {
        id: parseInt(params.id)
      }
    });

    return NextResponse.json({ message: "书签已删除" });
  } catch (error) {
    console.error("删除书签失败:", error);
    return NextResponse.json(
      { message: "删除书签失败" },
      { status: 500 }
    );
  }
} 