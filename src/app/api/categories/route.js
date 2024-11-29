// 导入 Prisma 客户端实例
import prisma from "@/utils/db";
// 导入 Next.js 的 Response 处理工具
import { NextResponse } from "next/server";

// 定义 GET 请求处理函数
export const GET = async () => {
  try {
    // 使用 Prisma 查询所有分类数据
    const categories = await prisma.category.findMany();

    // 将查询结果转换为 JSON 格式并返回成功状态(200)
    return new NextResponse(JSON.stringify(categories), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    // 如果发生错误，在控制台打印错误信息
    console.log(err);
    // 返回错误响应，包含错误信息和500状态码
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
