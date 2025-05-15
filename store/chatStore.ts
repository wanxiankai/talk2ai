import { getChatHistory } from '@/apis/get_chat_history';
import { getHistoryByPage } from '@/apis/get_history_by_page';
import { ChatHistoryType, Message, messageList } from '@/types/chat';
import { create } from 'zustand';

interface ChatListState {
    chatHistory: ChatHistoryType
    messageList: messageList
    isLoadingChatHistory: boolean
    isLoadingMessageList: boolean
    getChatHistory: (page: number) => Promise<void>
    updateChatHistoryList: (sessionId: string, content: string) => void
    fetchMessageList: (sessionId: string) => Promise<void>
    clearMessageList: () => void
    addNewMessage: (message: Message) => void
    updateLatestMessage: (message: Message) => void
}

export const useChatStore = create<ChatListState>((set, get) => ({
    chatHistory: {
        list: [],
        hasMore: true
    },
    messageList: [],
    isLoadingChatHistory: false,
    isLoadingMessageList: false,
    getChatHistory: async (page: number) => {
        console.log('getChatHistory', page,)
        if (!get().chatHistory.hasMore && get().isLoadingChatHistory) return
        set({ isLoadingChatHistory: true })
        const { data } = await getHistoryByPage(page);
        if (data.length === 0) {
            set({ chatHistory: { list: get().chatHistory.list, hasMore: false }, isLoadingChatHistory: false })
            return
        }
        set({ chatHistory: { list: [...get().chatHistory.list, ...data], hasMore: true }, isLoadingChatHistory: false })
    },
    updateChatHistoryList: (sessionId: string, content: string) => {
        //  if sessionId is not found,  create a new chat history with the sessionId and content as the first item to the list, else update the content of the chat history with the sessionId
        const chatHistoryList = get().chatHistory.list
        const hasMore = get().chatHistory.hasMore
        const chatHistoryIndex = chatHistoryList.findIndex((chat) => chat.session_id === sessionId)
        if (chatHistoryIndex === -1) {
            const newChatHistory = {
                session_id: sessionId,
                session_history: {
                    content: content,
                }
            }
            set({ chatHistory: { list: [newChatHistory, ...chatHistoryList], hasMore: hasMore } })
        } else {
            const chatHistory = chatHistoryList[chatHistoryIndex]
            chatHistory.session_history.content = content
            chatHistoryList.splice(chatHistoryIndex, 1, chatHistory)
            set({ chatHistory: { list: chatHistoryList, hasMore: hasMore } })
        }
    },
    fetchMessageList: async (sessionId: string) => {
        if (get().isLoadingMessageList) return
        set({ isLoadingMessageList: true })
        const response = await getChatHistory(sessionId);
        if (response) {
            set({ messageList: response })
        }
        set({ isLoadingMessageList: false })
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