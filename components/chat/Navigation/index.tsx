'use client'
import React from 'react'
import { useAppStore } from '@/store/appStore'
import classNames from 'classnames'
import SearchBar from './SearchBar'
import ChatList from './ChatList'
import NewChatButton from './NewChatButton'

export default function Navigation() {
    const showFullNav = useAppStore((state) => state.showFullNav)
    return (
        <nav className={classNames(showFullNav ? 'min-w-72 ' : 'hidden', 'h-full flex flex-col items-start bg-[#f9f9f9]')}>
            <SearchBar />
            <ChatList />
            <NewChatButton />
        </nav>
    )
}
