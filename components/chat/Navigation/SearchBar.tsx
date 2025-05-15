'use client'
import { useAppStore } from '@/store/appStore'
import Image from 'next/image'
import React, { useState } from 'react'

export default function SearchBar() {
    const setShowFullNav = useAppStore((state) => state.setShowFullNav)
    const [keyword, setKeyword] = useState('')

    return (
        <div className='w-full pl-[20px] flex flex-col items-start mb-12 pt-[20px] pr-[20px]'>
            <Image
                onClick={() => setShowFullNav(false)}
                src='/asserts/svg/expand.svg'
                className='cursor-pointer'
                width={20}
                height={20}
                alt='expand'
            />
            <div className='w-full flex flex-row items-center rounded-[10px] py-3 pl-3 bg-white mt-8'>
                <Image src='/asserts/svg/search.svg' width={12} height={12} alt='search' className='flex-none mr-1' />
                <input
                    type='text'
                    onChange={(e) => setKeyword(e.target.value)}
                    value={keyword}
                    className='w-full h-full bg-transparent outline-none placeholder:text-sm  placeholder:text-[#999]'
                    placeholder='Search' />
            </div>
        </div>
    )
}
