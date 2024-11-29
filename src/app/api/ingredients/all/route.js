import prisma from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 获取所有独特的食材名称
    const ingredients = await prisma.ingredient.findMany({
      distinct: ['name'],
      select: {
        name: true
      }
    });

    // 提取食材名称并排序
    const ingredientNames = ingredients
      .map(ing => ing.name)
      .sort((a, b) => a.localeCompare(b, 'zh-CN'));

    return NextResponse.json(ingredientNames);
  } catch (error) {
    console.error("Error fetching ingredients:", error);
    return NextResponse.json(
      { message: "Failed to fetch ingredients" },
      { status: 500 }
    );
  }
} 