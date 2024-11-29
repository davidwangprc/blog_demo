import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export async function POST(req) {
    try {
        const data = await req.formData();
        const file = data.get("file");

        if (!file) {
            return NextResponse.json(
                { message: "没有上传文件" },
                { status: 400 }
            );
        }

        // 检查文件大小 (10MB)
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json(
                { message: "文件大小不能超过10MB" },
                { status: 400 }
            );
        }

        // 检查文件类型
        if (!file.type.startsWith('image/')) {
            return NextResponse.json(
                { message: "只能上传图片文件" },
                { status: 400 }
            );
        }

        // 获取文件的字节数据
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // 生成唯一的文件名（移除可能的特殊字符）
        const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '');
        const filename = `${Date.now()}-${originalName}`;
        
        // 确保上传目录存在
        const uploadDir = path.join(process.cwd(), "public/uploads");
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }
        
        // 写入文件
        const filePath = path.join(uploadDir, filename);
        await writeFile(filePath, buffer);

        // 返回文件路径（注意：这里修改为filePath而不是url）
        return NextResponse.json({ 
            message: "上传成功",
            filePath: `uploads/${filename}` 
        });

    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { message: "上传失败", error: error.message },
            { status: 500 }
        );
    }
}

export const config = {
    api: {
        bodyParser: false,
        sizeLimit: '4mb',
    },
}; 