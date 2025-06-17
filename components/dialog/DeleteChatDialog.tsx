import React from 'react'
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog'
import SvgIcon from '../common/SvgIcon'
import { toast } from 'react-toastify'
import { useChatStore } from '@/store/chatStore'
import { useDialogStore } from '@/store/dialogStore'
import { INITCHATLISTPAGE } from '@/constant/events'
import eventBus from '@/lib/EventBus'

export default function DeleteChatDialog() {
    const { showDeleteChatDialog, deleteChatId, setShowDeleteChatDialog } = useDialogStore((state) => state)
    const { chatId, setChatId, clearMessageList, getChatHistory } = useChatStore((state) => state)


    const handleOpenChange = (open: boolean) => {
        setShowDeleteChatDialog(open, '')
    }

    const handleDelete = async () => {
        if (deleteChatId === chatId) {
            setChatId(null)
        }
        try {
            const res = await fetch(`/api/chat/delete?id=${deleteChatId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ chatId: deleteChatId }),
            })
            const data = await res.json()
            if (res.status !== 200) {
                toast.error(data.message)
                return
            }
            clearMessageList()
            eventBus.emit(INITCHATLISTPAGE)
            // await getChatHistory(1)
            setChatId(null)
            toast.success('Delete chat successfully')
        } catch (error) {
            console.log('error from delete session:', error)
            toast.error('Delete chat failed')
        }
        setShowDeleteChatDialog(false, '')
    }
    return (
        <Dialog defaultOpen={false} open={showDeleteChatDialog} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[413px] !rounded-2xl flex flex-col items-center justify-start bg-[#efefef] border-none" hideCloseButton>
                <div className='w-full flex flex-row items-center justify-between'>
                    <DialogTitle className='flex-1 text-center'>Delete Confirmation</DialogTitle>
                    <SvgIcon name='modal_close_icon' width={26} height={26} handleClick={() => setShowDeleteChatDialog(false, '')} />
                </div>
                <div className='text-base font-medium'>
                    Are you sure to delete this chat? This cannot
                    be undone.
                </div>

                <div className='flex flex-row'>
                    <div className='text-[#666] text-sm px-12 py-3 mr-7 cursor-pointer border border-[#999] rounded-xl' onClick={() => setShowDeleteChatDialog(false, '')}>Cancel</div>
                    <div className='text-white text-sm px-12 py-3 cursor-pointer rounded-xl bg-[#CC1678]' onClick={handleDelete}>Delete</div>
                </div>

            </DialogContent>
        </Dialog>
    )
}
