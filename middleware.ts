// ./middleware.ts
export { default } from "next-auth/middleware"

// 配置哪些路由需要保护
export const config = { matcher: ["/chat/:path*"] }