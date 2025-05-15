import { SPLIT_FLAG } from '@/constant'
import { ChatItemType } from '@/types/chat'
import React from 'react'
import { useChatStore } from '@/store/chatStore'
import classNames from 'classnames'

export default function ChatItem({ item }: { item: ChatItemType }) {
    const setSessionId = useUserStore((state) => state.setSessionId)
    const sessionId = useUserStore((state) => state.sessionId)
    const fetchMessageList = useChatStore((state) => state.fetchMessageList)
    const selectChat = async () => {
        if (item.session_id === sessionId) return
        await fetchMessageList(item.session_id)
        setSessionId(item.session_id)

    }
    const message = item.session_history.content.split(SPLIT_FLAG)[0]
    return (
        <div
            onClick={selectChat}
            className={classNames(sessionId === item.session_id ? '!bg-[#EBEBEB]' : '', 'w-64 pl-[10px] mx-[10px] cursor-pointer py-2 rounded-[10px] hover:!bg-[#EBEBEB]')}>
            <span className='text-[#333] text-sm font-normal line-clamp-1 max-w-64'>{message}</span>
        </div>
    )
}
