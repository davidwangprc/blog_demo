import prisma from "@/utils/db";
import { NextResponse } from "next/server";

// GET 获取所有书签分类
export async function GET() {
  try {
    const categories = await prisma.bookmarkCategory.findMany({
      include: {
        _count: {
          select: { bookmarks: true }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("获取书签分类失败:", error);
    return NextResponse.json(
      { message: "获取书签分类失败" },
      { status: 500 }
    );
  }
}

// POST 创建新的书签分类
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, slug, description, color, icon } = body;

    const category = await prisma.bookmarkCategory.create({
      data: {
        name,
        slug,
        description,
        color,
        icon
      }
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("创建书签分类失败:", error);
    return NextResponse.json(
      { message: "创建书签分类失败" },
      { status: 500 }
    );
  }
} 