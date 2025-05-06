import GitHubProvider from "next-auth/providers/github"
import TwitterProvider from "next-auth/providers/twitter"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_ID!,
      clientSecret: process.env.TWITTER_SECRET!,
      version: '2.0',
    }),
  ],
  pages: {
    signIn: "/", // 未登录访问/chat 时跳转到首页
  },
  session: {
    strategy: "database",
  },
}