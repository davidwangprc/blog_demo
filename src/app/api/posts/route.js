import prisma from "@/utils/db";
import { NextResponse } from "next/server";
import { createSlug } from "@/utils/slugify";

// 获取文章列表（添加分页功能）
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page")) || 1;
        const cat = searchParams.get("cat");
        const pageSize = parseInt(searchParams.get("pageSize")) || 4;

        // 构建查询条件
        const where = {
            published: true,
        };

        if (cat && cat.trim() !== '') {
            where.category = {
                slug: cat.trim()
            };
        }

        // 获取总数
        const total = await prisma.post.count({ where });

        // 计算偏移量
        const skip = (page - 1) * pageSize;

        // 获取分页数据
        const posts = await prisma.post.findMany({
            where,
            skip,
            take: pageSize,
            include: {
                author: {
                    select: {
                        name: true,
                        username: true,
                        avatar: true
                    }
                },
                category: true,
                tags: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({
            posts,
            total,
            pageSize,
            page,
            pageCount: Math.ceil(total / pageSize)
        });
    } catch (error) {
        console.error("Get posts error:", error);
        return NextResponse.json(
            { message: "服务器错误", error: error.message }, 
            { status: 500 }
        );
    }
}

// 创建新文章
export async function POST(req) {
    try {
        const body = await req.json();
        const { title, desc, content, image, categoryId, tags } = body;

        // 验证必要字段
        if (!title || !content || !categoryId) {
            return NextResponse.json(
                { message: "缺少必要字段" }, 
                { status: 400 }
            );
        }

        // 生成带时间戳的 slug
        const slug = createSlug(title);

        // 处理标签
        let tagsConnect = [];
        if (tags && Array.isArray(tags)) {
            tagsConnect = tags.filter(tag => tag && tag.id).map(tag => ({
                id: tag.id
            }));
        }

        const post = await prisma.post.create({
            data: {
                title,
                slug,
                description: desc,
                content,
                image,
                published: true,
                authorId: 1,
                categoryId,
                tags: tagsConnect.length > 0 ? {
                    connect: tagsConnect
                } : undefined
            },
            include: {
                author: true,
                category: true,
                tags: true
            }
        });

        return NextResponse.json(post, { status: 201 });
    } catch (error) {
        console.error("Post creation error:", error);
        return NextResponse.json(
            { message: "创建文章失败", error: error.message },
            { status: 500 }
        );
    }
} 