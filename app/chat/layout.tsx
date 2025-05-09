// ./app/chat/layout.tsx
import React from 'react';

// 如果你需要 getServerSession 来做一些预处理，可以在这里
// import { getServerSession } from 'next-auth/next';
// import { authOptions } from '../api/auth/[...nextauth]/route';
// import { redirect } from 'next/navigation';

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const session = await getServerSession(authOptions);
  // if (!session) {
  //   redirect('/'); // 虽然中间件会处理，这里也可以再加一层保险
  // }

  return (
    <div className="flex h-screen antialiased text-gray-800">
      {/* 侧边栏和主内容区将由 page.tsx 管理 */}
      {children}
    </div>
  );
}