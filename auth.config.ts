// auth.config.ts
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/",
  },
  providers: [
    // 注意：在这里定义 providers 时，不要直接引用 process.env，因为此文件可能用于 Edge。
    // 实际的 provider 配置（含 secrets）将在主 auth.ts 中完成。
    // 或者，如果 provider 配置不含 secrets (例如，仅指定名称)，则可以在这里定义。
  ],
  callbacks: {
    // 'authorized' 回调在这里，它接收从 JWT 解码的 'auth' 对象
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user; // 'auth' 对象是解码后的 JWT 内容
      const isOnChatPage = nextUrl.pathname.startsWith("/chat");

      if (isOnChatPage) {
        if (isLoggedIn) return true;
        return false; // 重定向到登录页 (由 NextAuth 中间件处理)
      } else if (isLoggedIn && nextUrl.pathname === "/") {
        return Response.redirect(new URL("/chat", nextUrl));
      }
      return true;
    },
  },
} satisfies NextAuthConfig;