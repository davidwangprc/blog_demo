import { NextResponse } from "next/server";

// 定义需要保护的路由
const protectedRoutes = [
  '/admin',
  '/writePost',
  '/createRecipe',
  '/api/posts/create',
  '/api/recipes/create',
  '/api/user/update'
];

export function middleware(request) {
  const adminToken = request.cookies.get("admin_token");
  
  // 检查是否是受保护的路由
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );
  
  if (isProtectedRoute && !adminToken) {
    console.log("Unauthorized access attempt:", request.nextUrl.pathname);
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/writePost',
    '/createRecipe',
    '/api/posts/create',
    '/api/recipes/create',
    '/api/user/update'
  ]
}; 