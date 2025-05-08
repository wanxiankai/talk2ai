// middleware.ts
import NextAuth from "next-auth";
import { authConfig } from "./auth.config"; // 导入不含 PrismaAdapter 的基础配置

// 使用仅包含 Edge 安全逻辑的 authConfig 来初始化 NextAuth for middleware
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/chat/:path*", "/"],
};