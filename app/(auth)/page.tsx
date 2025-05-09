// ./app/page.tsx
'use client';
import AuthFooter from '@/components/common/AuthFooter';
import Logo from '@/components/common/Logo';
import TypingCarousel from '@/components/common/TypingCarousel';
import VideoBackground from '@/components/common/VideoBackground';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation'; // 使用 next/navigation
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const [isSigningInGithub, setIsSigningInGithub] = useState(false);
  const [isSigningInX, setIsSigningInX] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // 如果用户已登录且状态为 "authenticated"，则重定向到聊天页面
    if (status === 'authenticated' && session) {
      router.push('/chat');
    }
  }, [session, status, router]);

  // 如果正在加载 session 或已登录，可以显示加载状态或不显示任何内容 (因为会被重定向)
  if (status === 'loading' || (status === 'authenticated' && session)) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // 用户未登录时显示登录按钮
  return (
    <div className="flex h-screen">
      <Logo />
      <div className="w-3/4 relative overflow-hidden bg-[#f2f2f2] backdrop-blur">
        <VideoBackground />
        <div className="absolute inset-0 flex flex-col justify-center pl-8">
          <div className='h-full flex flex-col justify-center'>
            <p className='text-6xl font-bold bg-gradient-to-r from-pink-500 via-[#F78C2A] to-[#fed9b6] bg-clip-text text-transparent'>The AI Chat App from Kevin Wan</p>
            <TypingCarousel />
          </div>
        </div>
      </div>
      <div className="w-1/4 min-w-[425px] flex flex-col items-center justify-between bg-[#F9F9F999]">
        <div className='flex-1' />
        <h2 className="text-3xl font-semibold mb-5 text-center text-[#333]">Get Started</h2>

        <div className="flex flex-col w-full max-w-xs gap-4 px-6">
          {/* github */}
          <button
            onClick={() => {
              setIsSigningInGithub(true); // Disable button immediately
              signIn('github', { callbackUrl: '/' });
            }}
            disabled={isSigningInGithub}
            className="cursor-pointer flex items-center justify-center gap-3 px-4 py-3 font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700"
          >
            {/* ... SVG icon ... */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-github-icon lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
            {isSigningInGithub ? '正在登录...' : '使用 GitHub 登录'}
          </button>
          {/* twitter  */}
          <button
            onClick={() => {
              setIsSigningInX(true); // Disable button immediately
              signIn('twitter', { callbackUrl: '/' });
            }}
            disabled={isSigningInX}
            className="cursor-pointer flex items-center justify-center gap-3 px-4 py-3 font-medium text-white bg-[#1DA1F2] rounded-md hover:bg-[#1A91DA]">
            {/* ...X SVG icon ... */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-twitter-icon lucide-twitter"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
            {isSigningInX ? '正在登录...' : '使用 X 登录'}
          </button>
        </div>
        <AuthFooter />
      </div>
    </div>
  );
}