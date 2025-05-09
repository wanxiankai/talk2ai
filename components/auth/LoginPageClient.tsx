// components/auth/LoginPageClient.tsx
"use client"; // 标记为客户端组件

import { signIn } from "next-auth/react"; // 从 next-auth/react 导入 signIn
import { Github, MessageSquareText as TwitterIcon } from "lucide-react"; // 导入图标
// import Image from "next/image"; // 如果使用 Twitter 图标图片

export default function LoginPageClient() {
  // 处理登录按钮点击事件
  const handleLogin = async (provider: "github" | "twitter") => {
    // 调用 signIn 函数，指定提供商和回调 URL
    // 成功登录后会重定向到 /chat
    await signIn(provider, { callbackUrl: "/chat" });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">欢迎回来！</h1>
        <p className="text-gray-600 mb-8 text-center">请选择登录方式开始聊天。</p>
        <div className="space-y-4">
          {/* GitHub 登录按钮 */}
          <button
            onClick={() => handleLogin("github")}
            className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            <Github className="mr-2 h-5 w-5" />
            使用 GitHub 登录
          </button>
          {/* Twitter 登录按钮 */}
          <button
            onClick={() => handleLogin("twitter")}
            className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-sky-500 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-400"
          >
            {/* 如果使用 lucide-react 的图标，可能需要找一个合适的 Twitter 图标或使用 SVG/Image */}
            <TwitterIcon className="mr-2 h-5 w-5" /> {/* 替换为合适的 Twitter 图标 */}
            {/* 或者使用 Image: <Image src="/path/to/twitter-logo.svg" alt="Twitter" width={20} height={20} className="mr-2" /> */}
            使用 Twitter 登录
          </button>
        </div>
      </div>
    </div>
  );
}