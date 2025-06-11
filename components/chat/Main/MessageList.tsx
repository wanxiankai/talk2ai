import React, { useRef } from 'react'
import { useChatStore } from '@/store/chatStore'
import classNames from 'classnames'
import Image from 'next/image'
import { answerStatusType } from '@/types/chat';
import { ChatContainerContent, ChatContainerRoot } from '@/components/ui/chat-container';
import { ScrollButton } from '@/components/ui/scroll-button';
import { Markdown } from '@/components/ui/markdown';


export default function MessageList() {
  const containerRef = useRef<HTMLDivElement>(null)
  const messageList = useChatStore(state => state.messageList)


  return (
    <div ref={containerRef} className='w-full min-w-[622px] flex-1 flex flex-col items-center justify-center overflow-y-auto mt-5 pt-5'>
      <ChatContainerRoot className='w-full'>
        <ChatContainerContent className='w-[840px] mx-auto'>
          {messageList.map((message, index) => {
            const isUser = message.role === 'user'
            const isAi = message.role === 'assistant'
            return (
              <li
                key={`${message.id}-${index}`}
                className={classNames(isUser ? 'flex justify-end' : 'flex justify-start', 'w-full mb-6')}
              >
                <div className='w-fit flex'>
                  {isAi && <Image src='/asserts/svg/agent_avatar.svg' alt='avatar' width={32} height={32} className='w-[32px] h-[32px] rounded-full mr-2' />}
                  <div className='flex flex-col gap-2'>
                    <div className={classNames("max-w-[646px]")}>
                      {isUser && <div className='bg-[#EFEFEF] w-fit ml-10 text-sm font-medium py-2 px-4 rounded-[10px]'><span>{message.content}</span></div>}
                      {isAi && <MessageContent type={message.answerStatus} msg={message.content} />}
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ChatContainerContent>
        <div className="absolute right-10 bottom-22">
          <ScrollButton />
        </div>
      </ChatContainerRoot>
    </div>
  )
}

const MessageContent = ({ type, msg }: { type: answerStatusType, msg: string }) => {
  switch (type) {
    case 'loading':
      return <MessageLoading />
    case 'error':
      return <MessageContentErrorText msg={msg} />
    case 'done':
      return <MessageContentText msg={msg} />
    default:
      return <MessageContentText msg={msg} />
  }
}

const MessageLoading = () => {
  return (
    <div className='w-fit flex flex-row items-center bg-[#FFF] text-sm font-medium py-2 px-4 rounded-[10px]'>
      <Image src="/asserts/gif/chat_loading.gif" alt="lighting" width={24} height={6} className='flex-none' />
      <span className='text-sm'>
        &nbsp;
      </span>
    </div>
  )
}

const MessageContentErrorText = ({ msg }: { msg: string }) => {
  return (<div className='w-fit text-sm font-medium py-2 px-4 rounded-[10px] bg-[#FFE6E3]'>
    <Markdown className="prose prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-h4:text-base prose-h5:text-sm prose-h6:text-xs">
      {msg}
    </Markdown>
  </div >)
}

const MessageContentText = ({ msg }: { msg: string }) => {
  return (<div className='w-fit max-w-[600px] text-sm font-medium py-2 px-4 rounded-[10px] bg-[#FFF]'>
    <Markdown className="prose prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-h4:text-base prose-h5:text-sm prose-h6:text-xs">
      {msg}
    </Markdown>
  </div >)
}