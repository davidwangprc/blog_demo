import prisma from "@/utils/db";
import { NextResponse } from "next/server";
import { createSlug } from "@/utils/slugify";

export const GET = async (req) => {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const RECIPES_PER_PAGE = 4;

    try {
        const recipes = await prisma.recipe.findMany({
            take: RECIPES_PER_PAGE,
            skip: RECIPES_PER_PAGE * (page - 1),
            include: {
                author: true,
                ingredients: true,
            },
        });

        const count = await prisma.recipe.count();

        return new NextResponse(
            JSON.stringify({ recipes, total: count, pageSize: RECIPES_PER_PAGE })
        );
    } catch (err) {
        console.log(err);
        return new NextResponse(
            JSON.stringify({ message: "Something went wrong!" }), 
            { status: 500 }
        );
    }
};

export const POST = async (req) => {    
    try {
        const body = await req.json();
        const { 
            title, 
            description,
            ingredients,
            steps,
            image,
            categoryId,
            cookingTime,
            servings,
            difficulty 
        } = body;

        // 验证必要字段
        if (!title || !description || !ingredients || !steps) {
            return NextResponse.json(
                { 
                    message: "缺少必要字段",
                    details: {
                        title: !title,
                        description: !description,
                        ingredients: !ingredients,
                        steps: !steps
                    }
                }, 
                { status: 400 }
            );
        }

        // 生成带时间戳的 slug
        const slug = createSlug(title);

        const recipe = await prisma.recipe.create({
            data: {
                title,
                description,
                slug,
                steps,
                image,
                cookingTime: cookingTime ? parseInt(cookingTime) : null,
                servings: servings ? parseInt(servings) : null,
                difficulty,
                categoryId: categoryId || 3, // 默认为 food 分类
                authorId: 1,
                ingredients: {
                    create: ingredients.map(ing => ({
                        name: ing.name,
                        amount: parseFloat(ing.amount),
                        unit: ing.unit
                    }))
                }
            },
            include: {
                ingredients: true,
                author: true,
                category: true
            }
        });

        return NextResponse.json(recipe, { status: 201 });
    } catch (error) {
        console.error("Recipe creation error:", error);
        return NextResponse.json(
            { message: "创建菜谱失败", error: error.message },
            { status: 500 }
        );
    }
}; 