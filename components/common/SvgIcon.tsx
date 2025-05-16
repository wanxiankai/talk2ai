'use client'
import classNames from 'classnames'
import Image from 'next/image'

export default function SvgIcon({ name, width, height, handleClick, className }: { name: string, width: number, height: number, handleClick?: () => void, className?: string}) {
    const logoSrc = `/asserts/svg/${name}.svg`
    return (
        <div
            className={classNames(handleClick ? 'cursor-pointer':'' , className)}
            onClick={handleClick}
        >
            <Image
                className="relative"
                src={logoSrc}
                alt={name}
                width={width}
                height={height}
                priority
            />
        </div>
    )
}
