/* eslint-disable @next/next/no-img-element */
'use client'
import React from 'react'

export default function Welcome() {
    return (
        <div className='flex flex-col mt-20 flex-1'>
            <div className='flex-none pl-8'>
                <img src='/asserts/svg/welcome_title.svg' alt='chatbg' className='w-[603px] h-[65px]' />
            </div>
            <div className='flex flex-row items-center justify-center mt-[100px] gap-8 text-sm font-normal'>
                <div className='w-48 min-h-38 bg-white rounded-3xl px-3.5 flex  items-center cursor-pointer hover:-translate-y-2 transform transition-transform duration-200 ease-in-out hover:shadow-[0_4px_30px_0_rgba(0,0,0,0.06)]'>
                    <span>
                        T2ai is a personal AI chatbot project of talk to ai.
                    </span>
                </div>
                <div className='w-48 min-h-38 bg-white rounded-3xl px-3.5 flex  items-center cursor-pointer hover:-translate-y-2 transform transition-transform duration-200 ease-in-out hover:shadow-[0_4px_30px_0_rgba(0,0,0,0.06)]'>
                    <span>
                        There are two free models available: Gemini and Grok.
                    </span>
                </div>
                <div className='w-48 min-h-38 bg-white rounded-3xl px-3.5 flex  items-center cursor-pointer hover:-translate-y-2 transform transition-transform duration-200 ease-in-out hover:shadow-[0_4px_30px_0_rgba(0,0,0,0.06)]'>
                    <span>
                        You can use it to ask questions about anything for free.
                    </span>
                </div>
                <div className='w-48 min-h-38 bg-white rounded-3xl px-3.5 flex  items-center cursor-pointer hover:-translate-y-2 transform transition-transform duration-200 ease-in-out hover:shadow-[0_4px_30px_0_rgba(0,0,0,0.06)]'>
                    <span>
                        Please give a star on github to support me if you like it.
                    </span>
                </div>
            </div>
        </div>
    )
}
