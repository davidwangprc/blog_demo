import prisma from "@/utils/db";
import { NextResponse } from "next/server";

// 获取单个食谱
export async function GET(req, { params }) {
  const { slug } = params;
  // console.log("API Route - Requested slug:", slug);

  try {
    // console.log("Searching for recipe with slug:", slug);
    const recipe = await prisma.recipe.findUnique({
      where: {
        slug: slug,
      },
      include: {
        author: {
          select: {
            name: true,
            avatar: true,
          },
        },
        category: true,
        ingredients: true,
        tags: true,
      },
    });

    // console.log("Recipe found:", recipe);

    if (!recipe) {
      console.log("Recipe not found for slug:", slug);
      return NextResponse.json(
        { message: "Recipe not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(recipe);
  } catch (error) {
    console.error("Error fetching recipe:", error);
    return NextResponse.json(
      { 
        message: "Internal server error",
        error: error.message,
        stack: error.stack
      },
      { status: 500 }
    );
  }
}

// 更新食谱
export async function PUT(req, { params }) {
    try {
        const body = await req.json();
        const { 
            title, 
            ingredients,
            steps,
            image,
            cookingTime,
            servings,
            difficulty 
        } = body;

        // 验证必填字段
        if (!title || !ingredients || !steps) {
            return NextResponse.json(
                { message: "Missing required fields" }, 
                { status: 400 }
            );
        }

        const recipe = await prisma.recipe.update({
            where: {
                id: parseInt(params.slug)
            },
            data: {
                title,
                steps,
                image,
                cookingTime,
                servings,
                difficulty,
                ingredients: {
                    deleteMany: {},
                    create: ingredients.map(ing => ({
                        name: ing.name,
                        amount: parseFloat(ing.amount),
                        unit: ing.unit
                    }))
                }
            },
            include: {
                ingredients: true,
                author: true
            }
        });

        return NextResponse.json(recipe);
    } catch (error) {
        console.error("Recipe update error:", error);
        return NextResponse.json(
            { message: "Failed to update recipe" },
            { status: 500 }
        );
    }
} 