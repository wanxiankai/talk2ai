import { ChatActionTypeEnums } from "@/constant"

export interface MessageRequestBody {
    messages: Message[]
    model: string
}

export interface Message {
    id?: string
    session_id?: string
    additional_kwargs?: {
        actions?: ActionItemType[]
        date?: string
        unique_id?: string
    }
    content: string
    type: "human" | "ai"
    waitAction?: boolean
    isChatting?: boolean
    answerStatus?: 'typing' | 'done'
    actions?: ActionItemType[]
}

export type ActionType = 'ask' | 'wallet' | 'backend' | 'table' | 'showdata' | 'history'

export interface ActionItemType {
    type: ActionType
    data: any
    code?: number
    info?: {
        content: string
        code?: number
    }
    statusText?: string
}

export type ActionsType = ActionItemType[]

export interface ChatItemType {
    session_id: string
    session_history: {
        content: string
    }
}

export interface ChatHistoryType {
    list: ChatItemType[]
    hasMore: boolean
}

export type messageList = Message[]

export type ChatHistoryList = ChatItemType[]

export type ActionType = typeof ChatActionTypeEnums