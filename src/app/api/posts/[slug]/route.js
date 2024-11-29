import prisma from "@/utils/db";
import { NextResponse } from "next/server";

// 获取单篇文章
export async function GET(req, { params }) {
    const { slug } = params;

    try {
        const post = await prisma.post.findUnique({
            where: {
                slug: slug,
            },
            include: {
                author: {
                    select: {
                        name: true,
                        avatar: true,
                    }
                },
                category: true,
                tags: true,
            },
        });

        if (!post) {
            return NextResponse.json(
                { message: "文章不存在" },
                { status: 404 }
            );
        }

        return NextResponse.json(post);
    } catch (error) {
        console.error("Error fetching post:", error);
        return NextResponse.json(
            { message: "服务器错误" },
            { status: 500 }
        );
    }
}

// 更新文章
export async function PUT(req, { params }) {
    try {
        const { slug } = params;
        const body = await req.json();
        const { title, content, description, image, categoryId, tags } = body;

        // 验证必要字段
        if (!title || !content || !categoryId) {
            return NextResponse.json(
                { message: "缺少必要字段" },
                { status: 400 }
            );
        }

        // 先检查文章是否存在
        const existingPost = await prisma.post.findUnique({
            where: { slug },
            include: { tags: true }
        });

        if (!existingPost) {
            return NextResponse.json(
                { message: "文章不存在" },
                { status: 404 }
            );
        }

        // 处理标签
        let tagsConnect = [];
        if (tags && Array.isArray(tags)) {
            tagsConnect = tags.map(tagId => ({ id: tagId }));
        }

        // 更新文章
        const updatedPost = await prisma.post.update({
            where: { slug },
            data: {
                title,
                content,
                description,
                image,
                categoryId,
                tags: {
                    disconnect: existingPost.tags.map(tag => ({ id: tag.id })), // 先移除所有现有标签
                    connect: tagsConnect // 连接新的标签
                }
            },
            include: {
                author: true,
                category: true,
                tags: true
            }
        });

        return NextResponse.json(updatedPost);
    } catch (error) {
        console.error("Error updating post:", error);
        return NextResponse.json(
            { message: "更新失败", error: error.message },
            { status: 500 }
        );
    }
} 