import React, { useEffect } from 'react'
import MainHeader from './MainHeader'
import Welcome from './Welcome'
import MessageList from './MessageList'
import ChatInput from './ChatInput'
import HelpIcon from './HelpIcon'
import { useChatStore } from '@/store/chatStore'

export default function Main() {
    const sessionId = useUserStore(state => state.sessionId)
    const fetchMessageList = useChatStore(state => state.fetchMessageList)
    useEffect(() => {
        if (sessionId) {
            initMessageList()
        }
    }, [])

    const initMessageList = async () => {
        if (sessionId) {
            await fetchMessageList(sessionId)
        }
    }

    return (
        <div className="flex flex-col items-center justify-start flex-1 bg-[url('/asserts/png/chatbg.png')] bg-center bg-no-repeat bg-cover">
            <main className='flex flex-col w-full h-full overflow-y-auto relative'>
                <MainHeader />
                {!sessionId && <Welcome />}
                <MessageList />
                <ChatInput />
                <HelpIcon />
            </main>
        </div>
    )
}
