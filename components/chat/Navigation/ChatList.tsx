'use client'
import React, { useCallback, useEffect, useState } from 'react'
import ChatItem from './ChatItem'
import { InView } from "react-intersection-observer";
import { useChatStore } from '@/store/chatStore'
import eventBus from '@/lib/EventBus';
import { INITCHATLISTPAGE } from '@/constant/events';

export default function ChatList() {
  const [page, setPage] = useState(1)
  const [refresh, setRefresh] = useState(false)
  const { chatHistory: { list, hasMore }, isSearching, isLoadingChatHistory, getChatHistory } = useChatStore((state) => state)

  const getChatListData = useCallback(async (page: number) => {
    await getChatHistory(page)
  }, [getChatHistory])


  useEffect(() => {
    getChatListData(page)
  }, [getChatListData, page, refresh])

  const handleInView = (inView: boolean) => {
    console.log('handleInView', inView, page, hasMore)
    if (inView && hasMore) {
      setPage((_page) => _page + 1)
    }
  }

  useEffect(() => {
    const initChatList: EventListener = () => {
      setPage(() => 1)
      setRefresh((prev) => !prev)
    }
    eventBus.on(INITCHATLISTPAGE, initChatList)
    return () => {
      eventBus.off(INITCHATLISTPAGE, initChatList)
    }
  }, [])

  return (
    <div className='min-w-72 flex-1 overflow-y-auto pb-5' id='scrollableDiv'>
      {
        list.length > 0 && (
          <div className='flex flex-col items-start gap-1 pl-[20px]'>
            {list.map((item, index) => <ChatItem key={index} item={item} />)}
          </div>
        )}
      {!isLoadingChatHistory && !isSearching && (<InView as="div" onChange={handleInView}></InView>)}
    </div>
  )
}
