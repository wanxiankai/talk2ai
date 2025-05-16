import React from 'react'
import Image from 'next/image'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import {
    LogOut,
    UserRound,
} from "lucide-react"
import { signOut, useSession } from 'next-auth/react'

export default function MainHeader() {
    const { data: session } = useSession();
    if (!session || !session.user) {
        return null;
    }

    const { user } = session
    const userName = user.name || user.email || '用户'; 
    const userImage = user.image || '/asserts/png/default-avatar.png'; 

    return (
        <div className='flex flex-row items-center justify-between pt-4 pl-8 pr-5'>
            <Image src='/asserts/png/ardio.png' alt='chat logo' width={92} height={23} />
            <div>
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
    )
}
