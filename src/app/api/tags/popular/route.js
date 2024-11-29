import prisma from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 获取标签使用次数统计
    const popularTags = await prisma.tag.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            posts: true,
            recipes: true
          }
        }
      }
    });

    // 计算每个标签的总使用次数并排序
    const tagsWithCount = popularTags.map(tag => ({
      id: tag.id,
      name: tag.name,
      count: tag._count.posts + tag._count.recipes
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // 只返回前10个

    return NextResponse.json(tagsWithCount);
  } catch (error) {
    console.error("Error fetching popular tags:", error);
    return NextResponse.json(
      { message: "Failed to fetch popular tags" },
      { status: 500 }
    );
  }
} 