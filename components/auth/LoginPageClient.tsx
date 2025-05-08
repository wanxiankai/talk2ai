// components/auth/LoginPageClient.tsx
"use client";

import { signIn } from "next-auth/react"; // 从 next-auth/react 导入 signIn
import { Github, MessageSquareText as TwitterIcon } from "lucide-react";

export default function LoginPageClient() {
  const handleLogin = async (provider: "github" | "twitter") => {
    // 调用 signIn 函数。对于 Auth.js v5, 通常不需要 callbackUrl，
    // 因为成功登录后，中间件或 authorized 回调会处理重定向。
    // 如果需要显式重定向，可以提供 options 对象。
    await signIn(provider, {
      // callbackUrl: "/chat", // 中间件配置后，这个可能不再严格需要
      // redirect: false, // 如果你想手动处理重定向，然后用 router.push
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">欢迎回来！</h1>
        <p className="text-gray-600 mb-8 text-center">请选择登录方式开始聊天。</p>
        <div className="space-y-4">
          <button
            onClick={() => handleLogin("github")}
            className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            <Github className="mr-2 h-5 w-5" />
            使用 GitHub 登录
          </button>
          <button
            onClick={() => handleLogin("twitter")}
            className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-sky-500 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-400"
          >
            <TwitterIcon className="mr-2 h-5 w-5" /> {/* 替换为合适的 Twitter 图标 */}
            使用 Twitter 登录
          </button>
        </div>
      </div>
    </div>
  );
}