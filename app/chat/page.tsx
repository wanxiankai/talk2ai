'use client'

import Main from '@/components/chat/Main'
import Navigation from '@/components/chat/Navigation'
import DeleteChatDialog from '@/components/dialog/DeleteChatDialog'
import React from 'react'

export default function Home() {
  return (
    <div className="flex-1 flex flex-row w-full overflow-y-auto overflow-x-hidden">
      <Navigation />
      <Main />
      <DeleteChatDialog />
    </div>
  )
}