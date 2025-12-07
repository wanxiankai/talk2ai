// ./proxy.ts (renamed from middleware.ts for Next.js 16)
// Note: next-auth v4 uses middleware pattern, we need to adapt for proxy
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request })
  
  // If no token and trying to access protected route, redirect to login
  if (!token) {
    const url = new URL("/(auth)", request.url)
    url.searchParams.set("callbackUrl", request.url)
    return NextResponse.redirect(url)
  }
  
  return NextResponse.next()
}

// 配置哪些路由需要保护
export const config = { matcher: ["/chat/:path*"] }