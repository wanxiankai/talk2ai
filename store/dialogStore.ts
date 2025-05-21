import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface DialogState {
    showDeleteChatDialog: boolean
    deleteChatId: string
    setShowDeleteChatDialog: (show: boolean, chatId: string) => void
}


export const useDialogStore = create<DialogState>()(
    devtools(
        (set, get) => ({
            showDeleteChatDialog: false,
            deleteChatId: '',
            setShowDeleteChatDialog: (show: boolean, chatId: string) => set({ showDeleteChatDialog: show, deleteChatId: chatId })
        })
    ))