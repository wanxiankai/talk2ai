/* eslint-disable @next/next/no-img-element */
'use client'
import React from 'react'

export default function Welcome() {
    return (
        <div className='flex flex-col mt-20 flex-1'>
            <div className='flex-none pl-8'>
                <img src='/asserts/svg/welcome_title.svg' alt='chatbg' className='w-[603px] h-[65px]' />
            </div>
            <div className='flex flex-row items-center justify-center mt-[100px] gap-4 text-sm font-normal'>
                <div className='w-48 bg-white rounded-3xl pt-5 pb-2.5 px-3.5 flex flex-col items-center hover:-translate-y-2 transform transition-transform duration-200 ease-in-out hover:shadow-[0_4px_30px_0_rgba(0,0,0,0.06)]'>
                    <span>
                        Pay Ardio Labs members’ salaries, just like last month.
                    </span>
                    <div className='w-full mt-[13px] flex items-center justify-between'>
                        <img src='/asserts/png/uim_box.png' alt='bitcion' className='w-[42px] h-[42px]' />
                    </div>

                </div>
                <div className='w-48 bg-white rounded-3xl pt-5 pb-2.5 px-3.5 flex flex-col items-center hover:-translate-y-2 transform transition-transform duration-200 ease-in-out hover:shadow-[0_4px_30px_0_rgba(0,0,0,0.06)]'>
                    <span>
                        What happened in crypto today?
                    </span>
                    <div className='w-full mt-[35px]'>
                        <img src='/asserts/png/uim_hangouts.png' alt='bitcion' className='w-[42px] h-[42px]' />
                    </div>
                </div>
                <div className='w-48 bg-white rounded-3xl pt-5 pb-2.5 px-3.5 flex flex-col items-center hover:-translate-y-2 transform transition-transform duration-200 ease-in-out hover:shadow-[0_4px_30px_0_rgba(0,0,0,0.06)]'>
                    <span>Help me buy $100 worth
                        of BTC.
                    </span>
                    <div className='w-full mt-[35px]'>
                        <img src='/asserts/png/uim_bitcoin.png' alt='bitcion' className='w-[42px] h-[42px]' />
                    </div>
                </div>
                <div className='w-48 bg-white rounded-3xl pt-5 pb-2.5 px-3.5 flex flex-col items-center hover:-translate-y-2 transform transition-transform duration-200 ease-in-out hover:shadow-[0_4px_30px_0_rgba(0,0,0,0.06)]'>
                    <span>I want Ardio to be
                        compatible with a new
                        contract.
                    </span>
                    <div className='w-full mt-[13px] flex items-center justify-between'>
                        <img src='/asserts/png/uim_chart.png' alt='bitcion' className='w-[42px] h-[42px]' />
                    </div>
                </div>
            </div>
        </div>
    )
}
