'use client'
import React, { useCallback, useEffect, useState } from 'react'
import ChatItem from './ChatItem'
// import eventBus from '@/context/EventBus'
import { InView } from "react-intersection-observer";
import { useChatStore } from '@/store/chatStore'

export default function ChatList() {
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [chatList, setChatList] = useState<any[]>([])
  const [isLoadingChatHistory, setIsLoadingChatHistory] = useState(false)
  // const [refresh, setRefresh] = useState(false)
  // const getChatHistory = useChatStore((state) => state.getChatHistory)
  // const isLoadingChatHistory = useChatStore((state) => state.isLoadingChatHistory)
  // const chatList = useChatStore((state) => state.chatHistory.list)
  // const hasMore = useChatStore((state) => state.chatHistory.hasMore)
  const getChatList = useCallback(async (page: number) => {
    if (!hasMore) return
    setIsLoadingChatHistory(true)
    const res = await fetch(`/api/chat/list?page=${page}`, {
      method: 'GET',
      cache: 'no-store',
    })
    if (!res.ok) {
      setIsLoadingChatHistory(false)
      throw new Error('Failed to fetch data')
    }
    const data = await res.json()
    if (data.code === 0) {
      const { list, hasMore } = data.data
      setChatList((prev) => [...prev, ...list])
      setHasMore(hasMore)
      setIsLoadingChatHistory(false)
    }
  }, [])

  useEffect(() => {
    getChatList(page)
  }, [getChatList, page])




  const handleInView = (inView: boolean) => {
    console.log('handleInView', inView, page, hasMore)
    if (inView && hasMore) {
      setPage((_page) => _page + 1)
    }
  }

  // useEffect(() => {
  //   const callback: EventListener = () => {
  //     setRefresh((prev) => !prev)
  //   }
  //   eventBus.on('fetchChatList', callback)
  //   return () => {
  //     eventBus.off('fetchChatList', callback)
  //   }
  // }, [])

  return (
    <div className='min-w-72 flex-1 overflow-y-auto pb-5' id='scrollableDiv'>
      {
        chatList.length > 0 && (
          <div className='flex flex-col items-start gap-1'>
            {chatList.map((item, index) => <ChatItem key={index} item={item} />)}
          </div>
        )}
      {!isLoadingChatHistory && (<InView as="div" onChange={handleInView}></InView>)}
    </div>
  )
}
