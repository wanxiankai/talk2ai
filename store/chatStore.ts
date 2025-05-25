import { ChatHistoryType, Message, messageList } from '@/types/chat';
import { create } from 'zustand';

type ModelType = {
    value: string
    label: string
    name: string
}

interface ChatListState {
    chatId: string | null
    model: string
    defaultSupportModels: ModelType[]
    chatHistory: ChatHistoryType
    messageList: messageList
    isLoadingChatHistory: boolean
    isLoadingMessageList: boolean
    setChatId: (chatId: string | null) => void
    setModel: (model: string) => void
    getChatHistory: (page: number) => Promise<void>
    fetchMessageList: (chatId: string) => Promise<void>
    clearMessageList: () => void
    addNewMessage: (message: Message) => void
    updateLatestMessage: (message: Message) => void
}

export const useChatStore = create<ChatListState>((set, get) => ({
    chatId: null,
    model: 'grok-2-vision-1212',
    defaultSupportModels: [
        { value: 'grok-2-vision-1212', label: 'Grok 2 Vision', name: 'Grok' },
        { value: 'gemini-gemini-2.0-flash', label: 'Gemini 2.0 Flash', name: 'Gemini' },
    ],
    chatHistory: {
        list: [],
        hasMore: true
    },
    messageList: [],
    isLoadingChatHistory: false,
    isLoadingMessageList: false,
    setChatId: (chatId: string | null) => {
        set({ chatId })
    },
    setModel: (model: string) => {
        set({ model })
    },
    getChatHistory: async (page: number) => {
        if (!get().chatHistory.hasMore && get().isLoadingChatHistory) return
        set({ isLoadingChatHistory: true })
        const res = await fetch(`/api/chat/list?page=${page}`, {
            method: 'GET',
            cache: 'no-store',
        })
        if (!res.ok) {
            set({ isLoadingChatHistory: false })
            throw new Error('Failed to fetch data')
        }
        const { data: { list, hasMore } } = await res.json()
        if (page === 1) {
            set({ chatHistory: { list, hasMore }, isLoadingChatHistory: false })
        } else {
            set({ chatHistory: { list: [...get().chatHistory.list, ...list], hasMore }, isLoadingChatHistory: false })
        }
    },

    fetchMessageList: async (chatId: string) => {
        if (get().isLoadingMessageList) return
        set({ isLoadingMessageList: true })
        const response = await fetch('/api/message/list?chatId=' + chatId, {
            method: 'GET',
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        if (!response.ok) {
            set({ isLoadingMessageList: false })
            throw new Error('Failed to fetch data')
        }
        const data = await response.json()
        if (data.code !== 0) {
            set({ isLoadingMessageList: false })
            throw new Error(data.message)
        }
        const { list } = data.data
        set({ messageList: list, isLoadingMessageList: false })
    },
    clearMessageList: () => {
        set({ messageList: [] })
    },
    addNewMessage: (message: Message) => {
        set((state) => {
            return {
                messageList: [...state.messageList, message]
            }
        })
    },
    updateLatestMessage: (message: Message) => {
        set((state) => {
            const removeLastMessage = state.messageList.slice(0, -1)
            return {
                messageList: [...removeLastMessage, message]
            }
        })
    }
}));