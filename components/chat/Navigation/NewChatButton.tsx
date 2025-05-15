'use client'
import React from 'react'
import { useChatStore } from '@/store/chatStore'
import Image from 'next/image'
import { toast } from 'react-toastify'
import { useUserStore } from '@/store/userStore'

export default function NewChatButton() {
  const clearMessageList = useChatStore(state => state.clearMessageList)
  const setSessionId = useUserStore(state => state.setSessionId)

  const handleNewChat = async () => {
    try {
      setSessionId(null)
      clearMessageList()
    } catch (error) {
      toast.error('Failed to create new chat')
    }
  }
  return (
    <div className='w-full pl-[20px] pb-[15px] pr-[20px]'>
      <div
        onClick={handleNewChat}
        className='flex flex-row items-center justify-center rounded-[10px] bg-white py-2 cursor-pointer hover:!bg-[#E9E9E9]'>
        <Image src='/asserts/svg/new_chat.svg' width={15} height={15} alt='new chat' className='flex-none mr-1.5' />
        <span className=' text-sm font-medium text-[#666]'>New Chat</span>
      </div>
    </div>
  )
}
