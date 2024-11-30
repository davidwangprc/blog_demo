import prisma from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const tags = searchParams.get("tags")?.split(",");
  
  try {
    if (type === "posts") {
      const startDate = searchParams.get("startDate");
      const endDate = searchParams.get("endDate");

      const where = {
        AND: [
          startDate ? { createdAt: { gte: new Date(startDate) } } : {},
          endDate ? { createdAt: { lte: new Date(endDate) } } : {},
          tags?.length ? { 
            OR: [
              { tags: { some: { id: { in: tags } } } },
<<<<<<< HEAD
              { recipes: { some: { tags: { some: { id: { in: tags } } } } } },
=======
              { recipes: { some: { tags: { some: { id: { in: tags } } } } } }, // 添加了这个逗号
>>>>>>> a1c02578788ad801e341092f83ef657bf98dc563
            ]
          } : {},
        ],
      };

      const posts = await prisma.post.findMany({
        where,
        include: {
          author: true,
          category: true,
          tags: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return NextResponse.json(posts);
    } else {
      const ingredients = searchParams.get("ingredients")?.split(",");
      const minTime = parseInt(searchParams.get("minTime"));
      const maxTime = parseInt(searchParams.get("maxTime"));
      const minServings = parseInt(searchParams.get("minServings"));
      const maxServings = parseInt(searchParams.get("maxServings"));

      const where = {
        AND: [
          ingredients?.length ? {
            ingredients: {
              some: {
                name: {
                  in: ingredients.map(i => i.trim()),
                },
              },
            },
          } : {},
          minTime ? { cookingTime: { gte: minTime } } : {},
          maxTime ? { cookingTime: { lte: maxTime } } : {},
          minServings ? { servings: { gte: minServings } } : {},
          maxServings ? { servings: { lte: maxServings } } : {},
        ],
      };

      const recipes = await prisma.recipe.findMany({
        where,
        include: {
          author: true,
          category: true,
          ingredients: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return NextResponse.json(recipes);
    }
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { message: "Search failed", error: error.message },
      { status: 500 }
    );
  }
} 
