import { ReactNode } from 'react'
import clsx from 'clsx'

type SidebarItemProps = {
  shouldExpand: boolean
  icon: ReactNode
  title: string
  active: boolean
  onClick: () => void
}

export default function SidebarItem({
  shouldExpand,
  icon,
  title,
  active,
  onClick
}: SidebarItemProps): JSX.Element {
  return (
    <div
      className={clsx(
        'flex cursor-pointer items-center transition-[background-color,fill,width,border-radius]',
        active
          ? shouldExpand && 'rounded-md bg-emerald-300 dark:bg-emerald-700'
          : shouldExpand && 'rounded-md hover:bg-gray-200 dark:hover:bg-gray-500'
      )}
      onClick={onClick}
    >
      <div
        className={clsx(
          'relative h-12 w-12 shrink-0 rounded-full transition-[background-color,fill]',
          active && !shouldExpand && 'bg-emerald-300 dark:bg-emerald-700'
        )}
        title={title}
      >
        <div className="absolute inset-0 m-auto h-fit w-fit">{icon}</div>
      </div>
      {shouldExpand && (
        <span className="mx-3 flex-grow overflow-hidden text-ellipsis whitespace-nowrap duration-0">
          {title}
        </span>
      )}
    </div>
  )
}
