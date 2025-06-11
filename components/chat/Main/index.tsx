import React, { useCallback, useEffect } from 'react'
import MainHeader from './MainHeader'
import Welcome from './Welcome'
import MessageList from './MessageList'
import ChatInput from './ChatInput'
import HelpIcon from './HelpIcon'
import { useChatStore } from '@/store/chatStore'

export default function Main() {
    const { chatId, fetchMessageList, messageList } = useChatStore(state => state)
    const initMessageList = useCallback(async () => {
        if (chatId) {
            await fetchMessageList(chatId)
        }
    }, [chatId, fetchMessageList])

    useEffect(() => {
        if (chatId) {
            initMessageList()
        }
    }, [chatId, initMessageList])


    return (
        <div className="flex flex-col items-center justify-start flex-1 bg-[url('/asserts/png/chatbg.png')] bg-center bg-no-repeat bg-cover">
            <main className='flex flex-col w-full h-full overflow-y-auto relative'>
                <MainHeader />
                {messageList.length === 0 && <Welcome />}
                <MessageList />
                <ChatInput />
                <HelpIcon />
            </main>
        </div>
    )
}
