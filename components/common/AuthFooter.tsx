'use client'
import Image from 'next/image'
import React from 'react'

export default function AuthFooter() {
    const handleGithub = () => {
        window.open('https://github.com/wanxiankai/talk2ai', '_blank')
    }

    return (
        <div className="text-center text-sm flex-1 flex flex-col items-center justify-end pb-10">
            <div
                onClick={handleGithub}
                className='flex items-center gap-1 text-[#000] text-xs font-semibold'>
                <p>Made by</p>
                <div
                    className='flex items-end hover:underline cursor-pointer'>
                    <Image src="/asserts/svg/github.svg" alt="github" width={15} height={15} className='mr-1' />
                    <p>wanxiankai</p>
                </div>
            </div>
        </div>
    )
}
