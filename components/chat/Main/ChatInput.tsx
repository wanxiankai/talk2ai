import SvgIcon from '@/components/common/SvgIcon'
import { useChatStore } from '@/store/chatStore'
import { Message } from '@/types/chat'
import React, { useEffect, useRef } from 'react'
import TextareaAutoSize from 'react-textarea-autosize'
import { toast } from 'react-toastify'

export default function ChatInput() {
    const [messageText, setMessageText] = React.useState('')
    const { chatId, setChatId, addNewMessage, updateLatestMessage, updateChatHistoryList } = useChatStore(state => state)
    const chatIdRef = useRef<string | null>(null)
    const isSendingRef = useRef(false)
    const stopRef = useRef(false)

    useEffect(() => {
        if (chatIdRef.current === chatId) {
            return
        }
        chatIdRef.current = chatId
        stopRef.current = true
    }, [chatId])


    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    const handleSendMessage = () => {
        if (messageText.trim() === '') return
        if (isSendingRef.current) return
        sendMessage(messageText)
    }

    const createOrGetSessionId = async () => {
        if (chatId === null) {
            const currentChatId = await createSession()
            if (!chatIdRef.current) {
                chatIdRef.current = currentChatId
                setChatId(currentChatId)
            }
            return currentChatId
        } else {
            return chatId
        }
    }

    const sendMessage = async (message: string) => {
        try {
            const currentChatId = await createOrGetSessionId()
            isSendingRef.current = true
            const currentMessage: Message = {
                id: new Date().getTime().toString(),
                chatId: currentChatId,
                content: message,
                role: 'human',
            }
            addNewMessage(currentMessage)
            const aiLoadingMessage: Message = {
                id: new Date().getTime().toString(),
                chatId: currentChatId,
                content: '',
                role: 'ai',
                answerStatus: 'typing',
                isChatting: true
            }
            addNewMessage(aiLoadingMessage)
            toChat(message, aiLoadingMessage, currentSessionId)

        } catch (error) {
            console.log('send message error:', error)
        }
    }


    const toChat = async (message: string, originAiMessage: Message, session_id: string) => {
        setMessageText('')
        const controller = new AbortController();
        const response = await chat(message, session_id, controller)
        if (response.status === 200) {
            if (!response.body) {
                console.log("body error")
                return
            } else {
                await processStreamResponse(response, originAiMessage)
            }
        } else {
            console.log('chat error:', response)
        }
    }


    return (
        <div className='w-full flex flex-row items-center justify-center pb-2.5'>
            <div className='w-[810px] relative flex flex-row items-center justify-between border-none rounded-[10px] bg-white pr-1.5 pl-3.5 py-1.5 outline-none focus-within:border-[#F78C2A]'>
                <TextareaAutoSize
                    className="outline-none flex-1 bg-transparent resize-none min-w-[650px] border-0 "
                    placeholder="Message Ardio"
                    rows={1}
                    maxRows={27}
                    value={messageText}
                    onChange={(e: any) => {
                        setMessageText(e.target.value)
                    }}
                    onKeyDown={handleKeyDown}
                />
                <div className='relative w-[20px] h-[20px] flex-none mr-1.5 cursor-pointer'>
                    <SvgIcon
                        name='file'
                        width={20}
                        height={20}
                        className='flex-none w-[20px] h-[20px]'
                    />
                </div>
                <div className='relative w-[20px] h-[20px] flex-none mr-4 cursor-pointer'>
                    <SvgIcon
                        name='voice'
                        width={20}
                        height={20}
                        className='flex-none w-[20px] h-[20px]'
                    />
                </div>
                <div onClick={handleSendMessage} className='relative w-[34px] h-[34px] flex-none'>
                    <SvgIcon
                        name={`${messageText.trim() === '' ? 'send' : 'send_actived'}`}
                        width={34}
                        height={34}
                        className='flex-none w-[34px] h-[34px]'
                    />
                </div>
            </div>
        </div>
    )
}
