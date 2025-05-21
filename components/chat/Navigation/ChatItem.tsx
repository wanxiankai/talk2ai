import { ChatItemType } from '@/types/chat'
import React from 'react'
import { useChatStore } from '@/store/chatStore'
import classNames from 'classnames'
import { Ellipsis, Trash2 } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useDialogStore } from '@/store/dialogStore'


export default function ChatItem({ item }: { item: ChatItemType }) {
    const { chatId, setChatId } = useChatStore(state => state)
    const fetchMessageList = useChatStore((state) => state.fetchMessageList)
    const { setShowDeleteChatDialog} = useDialogStore((state) => state)
    const selectChat = async () => {
        if (item.id === chatId) return
        await fetchMessageList(item.id)
        setChatId(item.id)
    }

    const handleDeleteChat = (e: React.MouseEvent) => {
        e.stopPropagation()
        setShowDeleteChatDialog(true, item.id)
    }

    return (
        <div
            onClick={selectChat}
            className={classNames(chatId === item.id ? '!bg-[#EBEBEB]' : '', 'relative w-64 flex items-center justify-between cursor-pointer p-2 rounded-[10px] group hover:!bg-[#EBEBEB]')}>
            <span className='w-full text-[#333] text-sm font-normal whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out group-hover:w-5/6'>{item.title}</span>
            <div
                className='absolute right-2 top-[8px] ml-2 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out'>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Ellipsis color="#bdbcbc" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="min-w-28">
                        <DropdownMenuItem
                            onClick={handleDeleteChat}
                            className='flex items-center cursor-pointer'>
                            <Trash2 color="#CC1678" className="mr-2 h-4 w-4" />
                            <span className='text-[#CC1678]'>Delete</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}
