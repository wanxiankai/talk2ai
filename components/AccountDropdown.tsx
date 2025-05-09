// ./components/AccountDropdown.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image'; // Next.js Image component for optimized images

export default function AccountDropdown() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    // 绑定事件监听器
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // 解绑事件监听器
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  if (!session || !session.user) {
    return null; // 如果没有 session 或 user 信息，则不渲染任何内容
  }

  const { user } = session;
  const userName = user.name || user.email || '用户'; // 显示昵称或邮箱，或默认"用户"
  const userImage = user.image;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-200 focus:outline-none transition-colors duration-150"
        aria-label="用户菜单"
        aria-expanded={isOpen}
      >
        {userImage ? (
          <Image
            src={userImage}
            alt={userName}
            width={36} // Tailwind class h-9 w-9
            height={36} // Tailwind class h-9 w-9
            className="rounded-full border border-gray-300"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold border border-gray-300">
            {userName.charAt(0).toUpperCase()} {/* 显示昵称首字母 */}
          </div>
        )}
        <span className="text-sm font-medium text-gray-700 hidden md:block truncate max-w-[100px]">
          {userName}
        </span>
        {/* 下拉箭头图标 */}
        <svg
          className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-20 py-1 border border-gray-200"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu-button"
        >
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="text-sm font-semibold text-gray-800 truncate">{userName}</p>
            {user.email && <p className="text-xs text-gray-500 truncate">{user.email}</p>}
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })} // 退出后跳转到首页
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-150"
            role="menuitem"
          >
            退出登录
          </button>
        </div>
      )}
    </div>
  );
}