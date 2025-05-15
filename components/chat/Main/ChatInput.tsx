import { sendAction } from '@/apis/action'
import { chat } from '@/apis/chat'
import { createSession } from '@/apis/create_session'
import SvgIcon from '@/components/common/SvgIcon'
import { SPLIT_FLAG } from '@/constant'
import eventBus from '@/context/EventBus'
import { useMetaMask } from '@/context/MetaMaskContext'
import { useChatStore } from '@/store/chatStore'
import { useUserStore } from '@/store/userStore'
import { ActionsType, Message } from '@/types/chat'
import React, { useEffect, useRef } from 'react'
import TextareaAutoSize from 'react-textarea-autosize'
import { toast } from 'react-toastify'

export default function ChatInput() {
    const { authrizationAccount } = useMetaMask()
    const [messageText, setMessageText] = React.useState('')
    const sessionId = useUserStore(state => state.sessionId)
    const setSessionId = useUserStore(state => state.setSessionId)
    const addNewMessage = useChatStore(state => state.addNewMessage)
    const updateLatestMessage = useChatStore(state => state.updateLatestMessage)
    const updateChatHistoryList = useChatStore(state => state.updateChatHistoryList)

    const chatIdRef = useRef<string | null>(null)
    const isSendingRef = useRef(false)
    const stopRef = useRef(false)

    useEffect(() => {
        if (chatIdRef.current === sessionId) {
            return
        }
        chatIdRef.current = sessionId
        stopRef.current = true
    }, [sessionId])


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
        if (sessionId === null) {
            const currentChatId = await createSession()
            if (!chatIdRef.current) {
                chatIdRef.current = currentChatId
                setSessionId(currentChatId)
            }
            return currentChatId
        } else {
            return sessionId
        }
    }

    const sendMessage = async (message: string) => {
        try {
            const currentSessionId = await createOrGetSessionId()
            isSendingRef.current = true
            const currentMessage: Message = {
                id: new Date().getTime().toString(),
                session_id: currentSessionId,
                content: message,
                type: 'human',
            }
            addNewMessage(currentMessage)
            const aiLoadingMessage: Message = {
                id: new Date().getTime().toString(),
                session_id: currentSessionId,
                content: '',
                type: 'ai',
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

    const processStreamResponse = async (response: Response, originAiMessage: Message) => {
        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let accumulatedContent = '';
        let hasSplitFlag = false;
        let answerStatus = 'typing'

        while (!done) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;

            if (done) {
                if (!hasSplitFlag) {
                    answerStatus = 'done'
                    updateLatestMessage({ ...originAiMessage, content: accumulatedContent, answerStatus: answerStatus as "typing" | "done" })
                    isSendingRef.current = false
                    updateChatHistoryList(originAiMessage.session_id!.toString(), accumulatedContent)
                    eventBus.emit('fetchChatList')
                } else {
                    const newContent = accumulatedContent.split(SPLIT_FLAG)[0]
                    answerStatus = 'done'
                    let originActions: ActionsType = []
                    try {
                        originActions = JSON.parse(accumulatedContent.split(SPLIT_FLAG)[1])
                        console.log('originActions:', originActions)
                    } catch (error) {
                        console.log('processStreamResponse error:', error)
                        originActions = [{
                            type: 'ask',
                            data: {
                                "func": "additional",
                                "params": {
                                    "status": 500,
                                    "content": "Wrong action structure"
                                },
                            },
                                statusText: 'Wrong action structure',
                                code: 500
                            }]
                    }
                    const actions = transferActions(originActions)
                    const lastMessage = { ...originAiMessage, content: newContent, answerStatus: answerStatus as "typing" | "done", actions }
                    updateLatestMessage(lastMessage)
                    updateChatHistoryList(originAiMessage.session_id!.toString(), newContent)
                    eventBus.emit('fetchChatList')
                    await handleActions(originActions, lastMessage, actions)
                    isSendingRef.current = false
                }
                break;
            }

            const chunk = decoder.decode(value);
            accumulatedContent += chunk;

            if (answerStatus === 'typing') {
                const splitIndex = accumulatedContent.indexOf(SPLIT_FLAG);
                if (splitIndex !== -1) {
                    answerStatus = 'done'
                    const newContent = accumulatedContent.substring(0, splitIndex);
                    updateLatestMessage({ ...originAiMessage, content: newContent, answerStatus: answerStatus as "typing" | "done", waitAction: true })
                    hasSplitFlag = true;
                } else {
                    const partialSplitIndex = SPLIT_FLAG.split('').findIndex((char, index) => {
                        return accumulatedContent.endsWith(SPLIT_FLAG.substring(0, index + 1));
                    });

                    if (partialSplitIndex === -1) {
                        answerStatus = 'typing'
                        updateLatestMessage({ ...originAiMessage, content: accumulatedContent, answerStatus: answerStatus as "typing" | "done" })
                    }
                }
            }


        }
    };

    const transferActions = (originActions: any) => {
        const actions: ActionsType = []
        originActions.forEach((originAction: any, index: number) => {
            const action = {
                data: originAction.data,
                type: originAction.type,
                statusText: `${index === 0 ? 'Processing···' : 'Waiting···'}`
            }
            actions.push(action)
        })
        return actions
    }

    const handleActions = async (actions: ActionsType, originAiMessage: Message, transferActions: ActionsType) => {
        let index = 0
        let len = actions.length
        while (index < len) {
            try {
                const startAction = updateActions(true, { data: { content: 'Processing···', status: 200 } }, transferActions, index);
                updateLatestMessage({ ...originAiMessage, actions: startAction })
                const response = await handleDiffTypeAction(actions, index, originAiMessage.session_id!)
                console.log('action response:', response)
                const endActions = updateActions(true, response, startAction, index);
                updateLatestMessage({ ...originAiMessage, actions: endActions })
                index++
            }
            catch (error) {
                const newActions = updateActions(false, '', actions, index);
                updateLatestMessage({ ...originAiMessage, actions: newActions })
                index++
            }
        }
    }

    const handleDiffTypeAction = async (actions: ActionsType, index: number, sessionId: string) => {
        const type = actions[index].type
        if (type === 'wallet') {
            return await handleWalletTypeAction(actions, index, sessionId)
        } else {
            const response = await sendAction(actions[index].data, index, sessionId)
            return response
        }
    }

    const handleWalletTypeAction = async (actions: ActionsType, index: number, sessionId: string) => {
        const authAmount = actions[index].data?.params?.amount || 100
        try {
            const authResponse = await authrizationAccount({ toChat: false, authAmount })
            if (authResponse) {
                const data = {
                    "func": "additional",
                    "params": {
                        "status": 200,
                        "content": "Transaction success"
                    }
                }
                const response = await sendAction(data, index, sessionId)
                return response
            } else {
                const data = {
                    "func": "additional",
                    "params": {
                        "status": 500,
                        "content": "Transaction fail"
                    }
                }
                const response = await sendAction(data, index, sessionId)
                return response
            }
        } catch (error) {
            console.log('handleWalletTypeAction error:', error)
            toast.error('Approve fail')
            const data = {
                "func": "additional",
                "params": {
                    "status": 500,
                    "content": "Transaction fail"
                }
            }
            const response = await sendAction(data, index, sessionId)
            return response
        }
    }


    const updateActions = (status: boolean, response: any, actions: ActionsType, index: number) => {
        const newActions = [...actions]
        if (status) {
            if (response.data.content === null) {
                // remove this action in actions
                newActions.splice(index, 1)
            } else {
                newActions[index].statusText = response.data.content
                newActions[index].code = response.status
            }
        } else {
            newActions[index].statusText = 'Action Failed'
            newActions[index].code = 500
        }
        return newActions
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
