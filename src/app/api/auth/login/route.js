import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const body = await req.json();
    const { username, password } = body;

    console.log("Login attempt for:", username);

    // 从数据库查找用户
    const user = await prisma.user.findUnique({
      where: { username }
    });

    console.log("Found user:", user ? "yes" : "no");

    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { message: "用户名或密码错误" },
        { status: 401 }
      );
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "用户名或密码错误" },
        { status: 401 }
      );
    }

    // 生成会话令牌
    const sessionToken = Math.random().toString(36).substring(2);
    
    const response = NextResponse.json(
      { 
        message: "登录成功",
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          avatar: user.avatar
        }
      },
      { status: 200 }
    );
    
    // 设置会话cookie
    response.cookies.set("admin_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60 // 24小时
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "服务器错误" },
      { status: 500 }
    );
  }
}