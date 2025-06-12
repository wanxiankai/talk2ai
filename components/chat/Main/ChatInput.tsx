import SvgIcon from '@/components/common/SvgIcon'
import { useChatStore } from '@/store/chatStore'
import { Message } from '@/types/chat'
import { useSession } from 'next-auth/react'
import React, { useEffect, useRef } from 'react'
import TextareaAutoSize from 'react-textarea-autosize'
import { toast } from 'react-toastify'

export default function ChatInput() {
    const { data: session } = useSession();
    const [messageText, setMessageText] = React.useState('')
    const { chatId, model, setChatId, addNewMessage, getChatHistory, messageList, updateLatestMessage } = useChatStore(state => state)
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
        if (!messageText.trim() || isSendingRef.current) return
        sendMessage()
    }

    const createOrGetChatId = async (message: string, role: string) => {
        if (chatId === null) {
            await createChat(message)
        }
        await createMessage(message, role)
    }

    const createChat = async (message: string) => {
        try {
            const response = await fetch('/api/chat/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: message.substring(0, 20),
                    model,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    userId: (session?.user as any).id,
                }),
            })
            if (!response.ok) {
                toast.error('创建聊天失败')
                throw new Error('Failed to create chat')
            }
            const { data } = await response.json()
            const currentChatId = data.chatId
            console.log('create chat', data.chatId, chatIdRef.current)
            if (!chatIdRef.current) {
                chatIdRef.current = currentChatId
                setChatId(currentChatId)
            }
            return currentChatId
        }
        catch (error) {
            console.error('Error creating chat:', error)
            toast.error('创建聊天失败')
            throw new Error('Failed to create chat')
        }
    }


    const createMessage = async (message: string, role: string) => {
        console.log('create message', chatIdRef.current)
        try {
            const response = await fetch('/api/message/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chatId: chatIdRef.current,
                    content: message,
                    role,
                }),
            })
            if (!response.ok) {
                toast.error('创建消息失败')
                throw new Error('Failed to create message')
            }
            const data = await response.json()
            const currentChatId = data.chatId
            if (!chatIdRef.current) {
                chatIdRef.current = currentChatId
                setChatId(currentChatId)
            }
            return currentChatId
        } catch (error) {
            console.error('Error creating message:', error)
            toast.error('创建消息失败')
            throw new Error('Failed to create message')
        }
    }


    const sendMessage = async () => {
        const userMessage: Message = {
            id: new Date().getTime().toString(),
            content: messageText.trim(),
            role: 'user',
        }
        addNewMessage(userMessage)
        const currentInput = messageText;
        setMessageText('')
        isSendingRef.current = true

        try {
            const currentAiResponseMessage: Message = {
                id: new Date().getTime().toString(),
                chatId: chatIdRef.current,
                content: '',
                role: 'assistant',
                answerStatus: 'loading',
            }
            addNewMessage(currentAiResponseMessage)
            await createOrGetChatId(currentInput, 'user')
            const messages = messageList.concat([userMessage])
            const requestBody = { messages, model }
            const controller = new AbortController();
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "text/event-stream",
                },
                signal: controller.signal,
                body: JSON.stringify(requestBody)
            })
            if (!response.ok) {
                console.log(response.statusText)
                return
            }
            if (!response.body) {
                console.log("body error")
                return
            }
            const reader = response.body.getReader()
            const decoder = new TextDecoder("utf-8")
            let done = false
            let content = ''
            while (!done) {
                const { value, done: doneReading } = await reader.read()
                done = doneReading
                const thunk = decoder.decode(value, { stream: !done })
                if (thunk) {
                    updateLatestMessage({ ...currentAiResponseMessage, content: content + thunk, answerStatus: 'pending' })
                    content += thunk
                    if (stopRef.current) {
                        stopRef.current = false
                        controller.abort()
                        break
                    }
                }
            }
            await createMessage(content, 'assistant')
            updateLatestMessage({ ...currentAiResponseMessage, content: content, answerStatus: 'done' })

        } catch (error) {
            console.error("发送消息或处理流式响应错误:", error);
            toast.error((error as Error).message || "与AI通信失败，请稍后再试");
            updateLatestMessage({ ...userMessage, content: '发送消息或处理流式响应错误', answerStatus: 'error' })

        } finally {
            isSendingRef.current = false
            await getChatHistory(1)
        }
    }

    return (
        <div className='w-full flex flex-row items-center justify-center pb-2.5'>
            <div className='w-[810px] relative flex flex-row items-center justify-between border-none rounded-[10px] bg-white pr-1.5 pl-3.5 py-1.5 outline-none focus-within:border-[#F78C2A]'>
                <TextareaAutoSize
                    className="outline-none flex-1 bg-transparent resize-none min-w-[650px] border-0 "
                    placeholder="Feel free to ask me anything..."
                    rows={1}
                    maxRows={27}
                    value={messageText}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {

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
