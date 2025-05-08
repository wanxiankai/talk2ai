// app/(auth)/page.tsx (对应路由 /)
import { auth } from "@/auth"; // 从 Auth.js 核心导入 auth 函数
import { redirect } from "next/navigation";
import LoginPageClient from "@/components/auth/LoginPageClient";

export default async function LoginPage() {
  const session = await auth(); // 获取服务器端会话

  // 如果用户已登录 (并且中间件没有处理重定向)，则重定向到聊天页面
  // 中间件通常会处理这个重定向，但这里可以作为双重保障
  if (session?.user) {
    redirect("/chat");
  }

  return <LoginPageClient />;
}