'use client'
import React from 'react'
import { Github } from '@lobehub/icons'
import { Star } from 'lucide-react'

export default function SocialMedia() {
  const followMeOn = () => {
    const url = 'https://github.com/wanxiankai/'
    window.open(url, '_blank')
  }
  const toStar = () => {
    const url = 'https://github.com/wanxiankai/talk2ai'
    window.open(url, '_blank')
  }



  return (
    <div className='w-full pl-[20px] pb-[15px] pr-[20px] flex flex-col items-center justify-center gap-2'>
      <div
        onClick={followMeOn}
        className='flex flex-row items-center cursor-pointer'>
        <div className='text-xs mr-1 font-normal hover:underline'>Follow me on</div>
        <Github size={14} />
      </div>

      <div
      onClick={toStar}
        className='flex flex-row items-center cursor-pointer'>
        <div className='text-xs mr-1 font-normal hover:underline'>To star this project</div>
        <Star width={14} height={14} />
      </div>
    </div>
  )
}
