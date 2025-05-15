import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface AppState {
    showFullNav: boolean
    setShowFullNav: (show: boolean) => void
}


export const useAppStore = create<AppState>()(
    devtools(
        (set, get) => ({
            showFullNav: true,
            setShowFullNav: (show: boolean) => set({ showFullNav: show }),
        })
    ))