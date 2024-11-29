import { NextResponse } from "next/server";

export async function POST() {
    try {
        const response = NextResponse.json(
            { 
                message: "登出成功",
                authenticated: false,
                isAdmin: false 
            },
            { status: 200 }
        );

        // 删除认证cookie
        response.cookies.delete("admin_token");
        
        // 确保cookie被完全清除
        response.cookies.set("admin_token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            expires: new Date(0)
        });

        return response;
    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json(
            { message: "登出失败" },
            { status: 500 }
        );
    }
} 