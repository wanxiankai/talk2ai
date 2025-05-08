// app/chat/layout.tsx
import Sidebar from "@/components/chat/Sidebar";
import { ReactNode } from "react";
import { auth } from "@/auth"; // 获取会话信息
// import { redirect } from "next/navigation"; // 中间件会处理重定向

export default async function ChatLayout({ children }: { children: ReactNode }) {
  const session = await auth(); // 获取当前会话

  // 中间件应该已经处理了未授权的访问。
  // 但如果需要，可以在这里再做一次检查或获取 userId。
  if (!session?.user?.id) {
    // 理论上中间件会阻止到达这里，除非中间件配置不当或有其他入口
    // redirect("/"); // 安全起见，可以保留，但最好依赖中间件
    // 或者可以抛出错误或返回一个未授权的组件
    return <div className="p-4">访问被拒绝或会话已过期。请重新登录。</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* <Sidebar userId={session.user.id} /> 将用户ID传递给侧边栏 */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {children}
      </main>
    </div>
  );
}