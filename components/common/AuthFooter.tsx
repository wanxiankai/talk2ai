import React from 'react'
import { Github } from '@lobehub/icons'

export default function AuthFooter() {
    const handleOpenTmsDoc = () => {
        window.open('https://github.com/wanxiankai/talk2ai', '_blank')
    }

    const handleOpenPrivacyDoc = () => {
        window.open('https://github.com/wanxiankai/talk2ai', '_blank')
    }

    const toGithub = () => {
        const url = 'https://github.com/wanxiankai'
        window.open(url, '_blank')
    }
    const goStar = () => {
        const url = 'https://github.com/wanxiankai/talk2ai'
        window.open(url, '_blank')
    }

    return (
        <div className="text-center text-sm flex-1 flex flex-col items-center justify-end pb-10">
            <div
                onClick={toGithub}
                className='flex items-center text-[#000] text-xs font-semibold cursor-pointer'>
                <p>Made by </p>
                <div className='font-bold text-xs underline ml-1'>wanxiankai</div>
            </div>

            <div className='flex items-center gap-1 mt-3.5'>
                <div
                    onClick={toGithub}
                    className='flex flex-row items-center cursor-pointer'>
                    <div className='text-xs mr-1 font-medium'>Follow me on</div>
                    <Github size={14} />
                </div>
                <span className='h-[9px] text-[#333] overflow-hidden'>{' | '}</span>
                <div
                    onClick={goStar}
                    className='flex flex-row items-center cursor-pointer'>
                    <div className='text-xs mr-1 font-medium'>Star this project</div>
                    <Github size={14} />
                </div>
            </div>

            <div className="mt-2 text-[#7d7d7d]">
                <span
                    onClick={handleOpenTmsDoc}
                    className="text-[#7d7d7d] text-xs cursor-pointer font-normal underline">Terms & Conditions</span>
                <span className='h-[9px] overflow-hidden text-[#7d7d7d]'>{' | '}</span>
                <span
                    onClick={handleOpenPrivacyDoc}
                    className="text-[#7d7d7d] text-xs cursor-pointer font-normal underline">Privacy policy</span>
            </div>
        </div>
    )
}
