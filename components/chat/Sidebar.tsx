// components/chat/Sidebar.tsx
"use client"; // 如果需要交互，例如从 Zustand store 获取数据或处理点击

import SearchBar from "./SearchBar";
import ChatList from "./ChatList";
// import { useChatStore } from "@/store/chatStore"; // 引入 Zustand store
import { LogOut, MessageSquarePlus } from "lucide-react";
import { signOut } from "next-auth/react";

interface SidebarProps {
  userId: string; // 从 layout 传入当前用户 ID
}

export default function Sidebar({ userId }: SidebarProps) {
  // const chats = useChatStore((state) => state.chats); // 从 Zustand 获取聊天列表
  // const fetchChats = useChatStore((state) => state.fetchUserChats); // 假设有此action

  // useEffect(() => {
  //   fetchChats(userId); // 组件挂载时获取用户聊天记录
  // }, [fetchChats, userId]);

  const handleNewChat = () => {
    // TODO: 实现开始新聊天的逻辑
    // 1. 调用 API 创建新聊天记录
    // 2. 更新 Zustand store
    // 3. 可能需要导航到新的聊天 (如果使用 [chatId] 路由)
    console.log("开始新聊天");
  };

  return (
    <aside className="w-64 md:w-72 lg:w-80 bg-gray-800 text-gray-100 p-4 flex flex-col space-y-4">
      {/* 顶部：新建聊天按钮和搜索框 */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold">聊天记录</h2>
        <button
          onClick={handleNewChat}
          title="开始新聊天"
          className="p-2 hover:bg-gray-700 rounded-md"
        >
          <MessageSquarePlus size={20} />
        </button>
      </div>
      <SearchBar />

      {/* 中间：聊天记录列表 */}
      <div className="flex-grow overflow-y-auto pr-1">
        {/* 传递 userId 以便 ChatList 获取特定用户的聊天记录 */}
        <ChatList currentUserId={userId} />
      </div>

      {/* 底部：联系方式和登出 */}
      <div className="pt-4 border-t border-gray-700">
        <p className="text-xs text-gray-400 mb-2">联系方式: support@example.com</p>
        <button
          onClick={() => signOut({ callbackUrl: "/" })} // 登出并重定向到首页
          className="w-full flex items-center justify-center p-2 bg-red-600 hover:bg-red-700 rounded-md text-sm"
        >
          <LogOut size={16} className="mr-2" />
          退出登录
        </button>
      </div>
    </aside>
  );
}