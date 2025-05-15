import React from 'react'
import { useChatStore } from '@/store/chatStore'
import classNames from 'classnames'
import Image from 'next/image'
import ScrollToBottom from 'react-scroll-to-bottom';
import ScrollToBottomButton from './ScrollToBottomButton';
import MarkDown from '@/components/common/MarkDown';
import { ActionItemType } from '@/types/chat';
import { SPLIT_FLAG } from '@/constant';


export default function MessageList() {
  const messageList = useChatStore(state => state.messageList)


  return (
    <div className='w-full min-w-[622px] flex-1 flex flex-col items-center justify-center overflow-y-auto mt-5'>
      <ScrollToBottom
        followButtonClassName='hidden'
        className='w-full flex-1 flex flex-col items-center justify-center overflow-y-auto'>
        <ScrollToBottomButton />
        <div className='w-full flex-1 flex flex-col items-center'>
          <ul className='w-[840px]'>
            {messageList.map((message, index) => {
              const isUser = message.type === 'human'
              const isAi = message.type === 'ai'
              const isChatting = !!message.isChatting
              let aiResponse = ''
              let aiActions: ActionItemType[] = []
              let userContent = message.content
              let waitAction = false
              let answerStatus;

              if (isChatting) {
                answerStatus = message.answerStatus || 'done'
                aiResponse = message.content
                if (answerStatus === 'done') {
                  waitAction = message?.waitAction || false
                  aiActions = message?.actions || []
                }
              } else {
                answerStatus = message.answerStatus || 'done'
                aiResponse = message.content.split(SPLIT_FLAG)[0]
                aiActions = message.additional_kwargs?.actions || []
              }

              return (
                <li
                  key={`${message.id}-${index}`}
                  className={classNames(isUser ? 'flex justify-end' : 'flex justify-start', 'w-full mb-6')}
                >
                  <div className='w-fit flex'>
                    {isAi && <Image src='/asserts/svg/agent_avatar.svg' alt='avatar' width={32} height={32} className='w-[32px] h-[32px] rounded-full mr-2' />}
                    <div className='flex flex-col gap-2'>
                      <div className={classNames(isUser ? 'bg-[#EFEFEF] ml-10' : 'bg-[#FFF]', "w-fit max-w-[646px] text-sm font-medium py-2 px-4 rounded-[10px]")}>
                        {isUser && <span>{userContent}</span>}
                        {isAi &&
                          <>
                            {
                              aiResponse ?
                                (<MarkDown content={aiResponse} />)
                                :
                                (
                                  <div className='flex flex-row items-center'>
                                    <Image src="/asserts/gif/chat_loading.gif" alt="lighting" width={24} height={6} className='flex-none' />
                                    <span className='text-sm'>
                                      &nbsp;
                                    </span>
                                  </div>
                                )
                            }
                          </>
                        }
                      </div>
                      {
                        waitAction && (
                          <div className={classNames("bg-[#FFFBE3] w-fit max-w-[646px] text-sm py-2 pl-2 pr-2 rounded-[10px]")}>
                            <div className='flex flex-row items-center'>
                              <Image src="/asserts/svg/lighting.svg" alt="lighting" width={16} height={16} className='mr-1.5 flex-none' />
                              <MarkDown content={'Processing···'} />
                            </div>
                          </div>
                        )
                      }
                      {
                        isChatting ?
                          (
                            aiActions.length > 0 && aiActions.map((action, index) => {
                              return (
                                <div
                                  key={index}
                                  className={classNames("bg-[#FFFBE3] w-fit max-w-[646px] text-sm py-2 pl-2 pr-2 rounded-[10px]")}>
                                  <div className='flex flex-row items-start'>
                                    <Image src="/asserts/svg/lighting.svg" alt="lighting" width={16} height={16} className='mr-1.5 flex-none' />
                                    <MarkDown content={action.statusText || ''} />
                                    {action.code ? action.code === 200 ? <Image src="/asserts/svg/success.svg" alt="success" width={14} height={14} className='ml-0.5 flex-none mt-1' /> : <Image src="/asserts/svg/error.svg" alt="error" width={14} height={14} className='ml-0.5 flex-none mt-1' /> : null}
                                  </div>
                                </div>
                              )
                            })
                          )
                          :
                          (
                            aiActions.length > 0 && aiActions.map((action, index) => {
                              const type = action.type
                              const info = action.info
                              if (info) {
                                if (type === 'history') {
                                  return (
                                    <div
                                      key={index}
                                      className={classNames(info.code === 200 ? "bg-[#FFFBE3]" : "bg-[#FFE6E3]", " w-fit max-w-[646px] text-sm py-2 pl-2 pr-2 rounded-[10px]")}>
                                      <div className='flex flex-row items-start'>
                                        <Image src="/asserts/svg/lighting.svg" alt="lighting" width={16} height={16} className='mr-1.5 flex-none' />
                                        <MarkDown content={info.content || ''} />
                                        {info.code === 200 ? <Image src="/asserts/svg/success.svg" alt="success" width={14} height={14} className='ml-0.5 flex-none mt-1' /> : <Image src="/asserts/svg/error.svg" alt="error" width={14} height={14} className='ml-0.5 flex-none mt-1' />}
                                      </div>
                                    </div>
                                  )
                                } else {
                                  return (
                                    <div
                                      key={index}
                                      className={classNames("bg-[#FFE6E3] w-fit max-w-[646px] text-sm py-2 pl-2 pr-2 rounded-[10px]")}>
                                      <div className='flex flex-row items-center'>
                                        <Image src="/asserts/svg/lighting.svg" alt="lighting" width={16} height={16} className='mr-1.5 flex-none' />
                                        <span className='text-sm font-medium text-[#333]'>{'Fail'}</span>
                                        <Image src="/asserts/svg/error.svg" alt="error" width={16} height={16} className='ml-0.5 flex-none' />
                                      </div>
                                    </div>
                                  )
                                }
                              }
                            })
                          )
                      }
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </ScrollToBottom>
    </div>
  )
}
