import { NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function PUT(req) {
  try {
    const adminToken = req.cookies.get("admin_token");
    
    if (!adminToken) {
      return NextResponse.json(
        { message: "未授权访问" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        isAdmin: true,
        username: "davidwang"
      }
    });

    if (!user) {
      return NextResponse.json(
        { message: "未授权访问" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { username, name, email, avatar } = body;

    // 更新用户信息
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        username,
        name,
        email,
        avatar
      }
    });

    delete updatedUser.password;

    return NextResponse.json({
      message: "更新成功",
      user: updatedUser
    });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { message: "更新失败" },
      { status: 500 }
    );
  }
}