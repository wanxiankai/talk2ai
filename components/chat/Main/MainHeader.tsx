import React from 'react'
import Image from 'next/image'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import {
    LogOut,
    Settings,
    UserRound,
    BadgeDollarSign
} from "lucide-react"
import { useMetaMask } from '@/context/MetaMaskContext'
import { toast } from 'react-toastify'
import { useUserStore } from '@/store/userStore'
import { formatAccountAddress } from '@/lib/formatAddress'

export default function MainHeader() {
    const { logout } = useMetaMask()
    const wallet = useUserStore(state => state.wallet)

    const copyAccount = () => {
        window.navigator.clipboard.writeText(wallet.account)
        toast.success('Copied to clipboard')
    }

    const handleCharge = () => {
        
    }

    return (
        <div className='flex flex-row items-center justify-between pt-4 pl-8 pr-5'>
            <Image src='/asserts/png/ardio.png' alt='chat logo' width={92} height={23} />
            <div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Image src='/asserts/svg/default_avatar.svg' alt='user' width={36} height={36} className='rounded-full cursor-pointer' />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-44">
                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={copyAccount}>
                                <UserRound className="mr-2 h-4 w-4" />
                                <span>{formatAccountAddress(wallet.account)}</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        {/* <DropdownMenuGroup>
                            <DropdownMenuItem onClick={handleCharge}>
                                <BadgeDollarSign className="mr-2 h-4 w-4" />
                                <span>Charge</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator /> */}
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}
