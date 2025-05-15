import  { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import TwitterProvider from "next-auth/providers/twitter";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "./prisma"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: "2.0", // 使用 Twitter API v2 进行 OAuth 2.0
    }),
    // 添加其他 provider...
  ],
  session: {
    strategy: "jwt", // 或者 "database" 如果你希望 session 存储在数据库
  },
  callbacks: {
    async session({ session, token }) {
      // 将 userId 添加到 session 对象
      if (token && session.user) {
        (session.user as any).id = token.sub; // token.sub 是用户的 ID
      }
      return session;
    },
    async jwt({ token, user }) {
      // 初始化时，user 对象可用
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: '/', // 登录页面的路由
    // error: '/auth/error', // 错误页面 (可选)
    // signOut: '/' // 退出后重定向的页面
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
};