// auth.ts
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter"; // Auth.js v5 的 Prisma Adapter
import prisma from "@/lib/prisma";
import GitHub from "next-auth/providers/github";
import Twitter from "next-auth/providers/twitter";
import { authConfig } from "./auth.config"; // 如果使用了 auth.config.ts

// 扩展 Session 和 User 类型以包含 id (与 v4 类似，但确保从 'next-auth' 导入)
// declare module "next-auth" {
//   interface Session {
//     user: {
//       id: string; // 确保与 Prisma User 模型中的 id 类型一致
//     } & DefaultSession["user"]; // 保留 DefaultSession 的其他属性
//   }
//   interface User { // Auth.js User 类型
//     id: string; // 确保与 Prisma User 模型中的 id 类型一致
//   }
// }


export const {
  handlers: { GET, POST }, // API 路由处理器
  auth,                     // 用于获取会话 (服务器端)
  signIn,                   // 登录函数
  signOut,                  // 登出函数
} = NextAuth({
  ...authConfig, // 合并 auth.config.ts 中的配置 (如果使用)

  // 如果不使用 auth.config.ts 或者 providers 依赖环境变量，直接在这里定义：
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Twitter({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
      // version: "2.0", // 如果 provider 支持显式声明
    }),
  ],
  session: {
    strategy: "database", // 使用数据库会话 (PrismaAdapter 推荐)
    // maxAge: 30 * 24 * 60 * 60, // 30 days
    // updateAge: 24 * 60 * 60, // 24 hours
  },
  // pages: authConfig.pages, // 如果从 auth.config.ts 导入

  // 回调函数
  callbacks: {
    // authorized: authConfig.callbacks?.authorized, // 如果从 auth.config.ts 导入

    // `session` 回调用于自定义发送到客户端的 session 对象
    async session({ session, user }) {
      console.log("Session callback:", { session, user });
      if (user && session.user) {
        session.user.id = user.id; // 将 Prisma User 的 id 添加到 session.user 对象
      }
      return session;
    },
    // `jwt` 回调在创建或更新 JWT 时调用 (如果 session strategy 是 "jwt")
    // async jwt({ token, user }) {
    //   if (user) {
    //     token.id = user.id;
    //   }
    //   return token;
    // },

    // signIn 回调，可以在用户登录时执行额外逻辑
    async signIn({ user, account, profile, email, credentials }) {
      // console.log("Sign in callback:", { user, account, profile });
      // 可以用来阻止某些用户登录，或在首次登录时执行操作
      // if (account?.provider === "github" && !profile?.email?.endsWith("@example.com")) {
      //   return false; // 阻止非特定邮箱后缀的 GitHub 用户登录
      // }
      return true; // 允许登录
    },
  },
  // 调试模式 (仅限开发环境)
  debug: process.env.NODE_ENV === "development",
  secret: process.env.AUTH_SECRET, // 使用 .env.local 中的 AUTH_SECRET
});