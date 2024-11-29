import { NextResponse } from "next/server";
import prisma from "@/utils/db";

// 获取所有标签
export async function GET() {
    try {
        const tags = await prisma.tag.findMany();
        return NextResponse.json(tags);
    } catch (error) {
        console.error("Failed to fetch tags:", error);
        return NextResponse.json(
            { error: "Failed to fetch tags" },
            { status: 500 }
        );
    }
}

// 创建新标签
export async function POST(req) {
    try {
        const body = await req.json();
        let { name } = body;

        // 验证标签名
        if (!name || typeof name !== 'string') {
            return NextResponse.json(
                { message: "标签名称不能为空" },
                { status: 400 }
            );
        }

        // 标准化标签名（去除首尾空格）
        name = name.trim();

        if (name.length < 2 || name.length > 20) {
            return NextResponse.json(
                { message: "标签名称长度必须在2-20个字符之间" },
                { status: 400 }
            );
        }

        // 生成 slug（将标签名转换为 URL 友好的格式）
        const slug = name.toLowerCase()
            .replace(/\s+/g, '-')           // 将空格替换为连字符
            .replace(/[^\w\-\u4e00-\u9fa5]+/g, '') // 只保留字母、数字、连字符和中文
            .replace(/\-\-+/g, '-')         // 将多个连字符替换为单个连字符
            .replace(/^-+/, '')             // 移除开头的连字符
            .replace(/-+$/, '');            // 移除结尾的连字符

        // 如果生成的 slug 为空，说明输入只包含特殊字符
        if (!slug) {
            return NextResponse.json(
                { message: "标签名称必须包含字母、数字或中文字符" },
                { status: 400 }
            );
        }

        try {
            const newTag = await prisma.tag.create({
                data: { 
                    name,
                    slug 
                },
            });
            return NextResponse.json(newTag);
        } catch (error) {
            // 处理唯一约束冲突
            if (error.code === 'P2002') {
                return NextResponse.json(
                    { message: `标签 "${name}" 已存在` },
                    { status: 400 }
                );
            }
            throw error; // 抛出其他错误以便外层捕获
        }
    } catch (error) {
        console.error("Failed to create tag:", error);
        return NextResponse.json(
            { message: "创建标签失败，请稍后重试" },
            { status: 500 }
        );
    }
} 