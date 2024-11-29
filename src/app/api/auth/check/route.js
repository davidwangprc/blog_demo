import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    const adminToken = req.cookies.get("admin_token");

    if (!adminToken) {
      return NextResponse.json(
        { 
          authenticated: false,
          message: "未登录" 
        },
        { status: 401 }
      );
    }

    // 这里可以添加更严格的token验证
    // 但由于是本地开发环境，暂时只检查cookie存在性
    const user = await prisma.user.findFirst({
      where: {
        isAdmin: true,
        username: "davidwang"
      },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        isAdmin: true,
        avatar: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { 
          authenticated: false,
          message: "用户不存在或非管理员" 
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user: user,
      isAdmin: true
    });

  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      { 
        authenticated: false,
        message: "验证会话时发生错误" 
      },
      { status: 500 }
    );
  }
}
