import React from 'react'
import Image from 'next/image'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import {
    LogOut,
    UserRound,
} from "lucide-react"
import { signOut, useSession } from 'next-auth/react'
import { useAppStore } from '@/store/appStore'
import { useChatStore } from '@/store/chatStore'
import { toast } from 'react-toastify'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Gemini, Grok } from '@lobehub/icons'

export default function MainHeader() {
    const { data: session } = useSession();
    const { showFullNav, setShowFullNav } = useAppStore(state => state)
    const { defaultSupportModels, setChatId, clearMessageList, model, setModel } = useChatStore(state => state)
    if (!session || !session.user) {
        return null;
    }
    const { user } = session
    const userName = user.name || user.email || '用户';
    const userImage = user.image || '/asserts/png/default-avatar.png';

    const handleNewChat = async () => {
        try {
            setChatId(null)
            clearMessageList()
        } catch (error) {
            console.log(error)
            toast.error('Failed to create new chat')
        }
    }

    const handleChangeModel = (value: string) => {
        setModel(value)
        setChatId(null)
        clearMessageList()
    }

    return (
        <div className='flex flex-row items-center justify-between pt-4 pr-5'>
            <div className='flex items-end pl-[20px]'>
                {!showFullNav &&
                    <Image
                        onClick={() => setShowFullNav(true)}
                        src='/asserts/svg/expand.svg'
                        className='cursor-pointer mr-2'
                        width={20}
                        height={20}
                        alt='expand'
                    />
                }
                {/* <div className='w-[92px] h-[23px] flex-none cursor-pointer' onClick={handleNewChat}>
                    <Image src='/asserts/png/t2ai.png' alt='chat logo' width={92} height={23} />
                </div> */}
            </div>
            <div className='flex items-center'>
                <div className='flex flex-col items-end min-w-36'>
                    <Select defaultValue={model} onValueChange={handleChangeModel} value={model}>
                        <SelectTrigger
                            defaultValue={model}
                            className="min-w-36 bg-white cursor-pointer items-center py-2 border-none text-[#333] rounded-xl [&_[data-description]]:hidden focus:ring-transparent"
                        >
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className='min-w-36 bg-white'>
                            {defaultSupportModels.map((item) => (
                                <SelectItem value={item.value} key={item.value}>
                                    <div className="flex items-center justify-between gap-3 cursor-pointer">
                                        {item.name === 'Grok' ? <Grok size={24} /> : <Gemini size={24} />}
                                        <div className="grid gap-0.5">
                                            {item.label}
                                        </div>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className='ml-2'>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Image src={userImage} alt='user' width={36} height={36} className='rounded-full cursor-pointer' />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-44">
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <UserRound className="mr-2 h-4 w-4" />
                                    <span>{userName}</span>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => signOut()}>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    )
}
