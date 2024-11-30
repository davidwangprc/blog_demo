import prisma from "@/utils/db";
import { NextResponse } from "next/server";

// GET 获取书签列表
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("category");
    const featured = searchParams.get("featured");
    
    // 构建查询条件
    const where = {};
    if (categoryId) {
      where.categoryId = parseInt(categoryId);
    }
    if (featured) {
      where.featured = featured === 'true';
    }

    const bookmarks = await prisma.bookmark.findMany({
      where,
      include: {
        category: true,
        tags: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      },
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json(bookmarks);
  } catch (error) {
    console.error("获取书签失败:", error);
    return NextResponse.json(
      { message: "获取书签失败" },
      { status: 500 }
    );
  }
}

// POST 创建新书签
export async function POST(req) {
  try {
    const body = await req.json();
    const { title, url, description, icon, screenshot, categoryId, tags } = body;

    const bookmark = await prisma.bookmark.create({
      data: {
        title,
        url,
        description,
        icon,
        screenshot,
        categoryId: parseInt(categoryId),
        tags: {
          connect: tags.map(tagId => ({ id: tagId }))
        }
      },
      include: {
        category: true,
        tags: true
      }
    });

    return NextResponse.json(bookmark);
  } catch (error) {
    console.error("创建书签失败:", error);
    return NextResponse.json(
      { message: "创建书签失败" },
      { status: 500 }
    );
  }
} 