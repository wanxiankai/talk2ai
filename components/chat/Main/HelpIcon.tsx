import SvgIcon from '@/components/common/SvgIcon'
import React from 'react'

export default function HelpIcon() {
  return (
    <div className='absolute right-0 bottom-0 mr-3 mb-3'>
      <div className='relative w-[24px] h-[24px] flex-none cursor-pointer'>
        <SvgIcon
          name='help'
          width={24}
          height={24}
          className='flex-none w-[24px] h-[24px]'
        />
      </div>
    </div>
  )
}
