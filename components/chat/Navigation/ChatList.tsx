'use client'
import React, { useCallback, useEffect, useState } from 'react'
import ChatItem from './ChatItem'
import { InView } from "react-intersection-observer";
import { useChatStore } from '@/store/chatStore'

export default function ChatList() {
  const [page, setPage] = useState(1)
  const { chatHistory: { list, hasMore }, isLoadingChatHistory, getChatHistory } = useChatStore((state) => state)

  const getChatListData = useCallback(async (page: number) => {
    await getChatHistory(page)
  }, [getChatHistory])


  useEffect(() => {
    getChatListData(page)
  }, [getChatListData, page])

  const handleInView = (inView: boolean) => {
    console.log('handleInView', inView, page, hasMore)
    if (inView && hasMore) {
      setPage((_page) => _page + 1)
    }
  }

  return (
    <div className='min-w-72 flex-1 overflow-y-auto pb-5' id='scrollableDiv'>
      {
        list.length > 0 && (
          <div className='flex flex-col items-start gap-1 pl-[20px]'>
            {list.map((item, index) => <ChatItem key={index} item={item} />)}
          </div>
        )}
      {!isLoadingChatHistory && (<InView as="div" onChange={handleInView}></InView>)}
    </div>
  )
}
