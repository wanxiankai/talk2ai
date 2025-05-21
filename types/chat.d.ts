import { ChatActionTypeEnums } from "@/constant"

export interface MessageRequestBody {
    messages: Message[]
    model: string
}

export interface Message {
    id: string
    content: string
    role: string
    chatId?: string | null
    createTime?: string
    updateTime?: string
    answerStatus?: 'loading' | 'pending' | 'done' | 'error'
}

export interface ChatItemType {
    id: string
    title: string
    model: string
    userId: string
    messages: Message[]
    updateTime: string
    createTime: string
}

export interface ChatHistoryType {
    list: ChatItemType[]
    hasMore: boolean
}

export type messageList = Message[]

export type ChatHistoryList = ChatItemType[]

export type ActionType = typeof ChatActionTypeEnums