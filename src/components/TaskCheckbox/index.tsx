import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import styles from './styles.module.css'

import { TaskCheckboxProps } from '@/interfaces'
import { Icon } from '@/components'
import { openWindow } from '@/utils'
import { useUpdateTaskFinishStateRequest } from '@/requests'

export default function TaskCheckbox({
  task,
  noteType,
  editable,
  draggable,
  className,
  inputClassName,
  inputWrapperClassName,
  register = {},
  removeTask,
  changeChecked,
  changeContent,
  changeLinkUrl,
  copyLinkUrl
}: TaskCheckboxProps): JSX.Element | null {
  const { t } = useTranslation(['common', 'note'])

  // DND
  const [dragOver, setDragOver] = useState<boolean>(false)

  const [showButton, setShowButton] = useState<boolean>(false)
  const [linkEditable, setLinkEditable] = useState<boolean>(false)

  const [checked, setChecked] = useState<boolean>(false)
  const [content, setContent] = useState<string | undefined | null>(task?.content)

  const { mutate: updateFinishState } = useUpdateTaskFinishStateRequest(noteType)

  useEffect(() => {
    if (task) {
      if (task.finished) {
        setChecked(true)
      }
      if (task.finishedAt && task.finishedAt !== null) {
        setChecked(true)
      }
      setLinkEditable(typeof task.linkUrl === 'string')
    }
  }, [task])

  if (!task) {
    return null
  }

  return (
    <div
      className={clsx(
        'flex flex-col gap-1.5 transition-[visibility,opacity]',
        dragOver ? 'invisible opacity-0' : 'visible opacity-100',
        className
      )}
      draggable={draggable}
      onDragStart={(e) => {
        e.stopPropagation()
        setDragOver(true)
      }}
      onDragEnd={(e) => {
        e.stopPropagation()
        setDragOver(false)
      }}
      onMouseEnter={(e) => {
        e.stopPropagation()
        setShowButton(true)
      }}
      onMouseLeave={(e) => {
        e.stopPropagation()
        setShowButton(false)
      }}
    >
      <div className="flex gap-2">
        <div
          className={clsx(
            'flex h-5 w-5 shrink-0 items-center justify-center',
            inputWrapperClassName
          )}
        >
          <input
            type="checkbox"
            checked={checked}
            onClick={(e) => {
              e.stopPropagation()
            }}
            onChange={(e) => {
              e.stopPropagation()
              setChecked(e.currentTarget.checked)
              if (editable) {
                changeChecked && changeChecked()
              } else {
                if (typeof task.id === 'number') {
                  updateFinishState({
                    id: task.id,
                    finished: e.currentTarget.checked
                  })
                }
              }
            }}
            className={clsx(
              'daisy-checkbox daisy-checkbox-primary h-4 w-4 rounded-sm',
              inputClassName
            )}
            {...register}
          />
        </div>
        <div
          className={clsx(
            styles.textarea,
            editable ? styles.editableInputWidth : styles.inputWidth,
            'select-text break-words text-sm font-normal tracking-wide outline-none placeholder:text-gray-500 empty:before:text-gray-500 empty:before:content-[attr(placeholder)] dark:text-noteSecondTextDark dark:placeholder-gray-400',
            task?.finished && content && 'text-gray-500 line-through opacity-75',
            editable ? 'cursor-auto' : 'cursor-pointer'
          )}
          contentEditable={editable}
          onInput={(e) => {
            e.stopPropagation()
            changeContent && changeContent(e.currentTarget.textContent)
            setContent(e.currentTarget.textContent)
          }}
          placeholder={editable ? t('note:TASK.PLACEHOLDER.CONTENT') : undefined}
          dangerouslySetInnerHTML={{ __html: task.content ?? '' }}
        />
        {editable && (
          <div className="flex shrink-0 gap-0.5">
            {linkEditable ? (
              <div
                className={clsx(
                  'flex h-5 w-5 cursor-pointer select-none items-center justify-center rounded-full p-0.5 transition-[visibility,opacity,background-color,transform] hover:bg-gray-200 active:bg-gray-100 dark:hover:bg-gray-500 dark:active:bg-gray-600',
                  showButton ? 'visible scale-100 opacity-100' : 'invisible scale-0 opacity-0'
                )}
                onClick={(e) => {
                  e.stopPropagation()
                  setLinkEditable(false)
                  changeLinkUrl && changeLinkUrl(null)
                }}
                title={t('common:REMOVE.LINK')}
              >
                <Icon.LinkOff
                  width="18"
                  height="18"
                  className="fill-black dark:fill-white"
                />
              </div>
            ) : (
              <div
                className={clsx(
                  'flex h-5 w-5 cursor-pointer select-none items-center justify-center rounded-full p-0.5 transition-[visibility,opacity,background-color,transform] hover:bg-gray-200 active:bg-gray-100 dark:hover:bg-gray-500 dark:active:bg-gray-600',
                  showButton ? 'visible scale-100 opacity-100' : 'invisible scale-0 opacity-0'
                )}
                onClick={(e) => {
                  e.stopPropagation()
                  setLinkEditable(true)
                  changeLinkUrl && changeLinkUrl('')
                }}
                title={t('common:ADD.LINK')}
              >
                <Icon.AddLink
                  width="18"
                  height="18"
                  className="fill-black dark:fill-white"
                />
              </div>
            )}
            <div
              className={clsx(
                'flex h-5 w-5 cursor-pointer select-none items-center justify-center rounded-full p-0.5 transition-[visibility,opacity,background-color,transform] hover:bg-gray-200 active:bg-gray-100 dark:hover:bg-gray-500 dark:active:bg-gray-600',
                showButton ? 'visible scale-100 opacity-100' : 'invisible scale-0 opacity-0'
              )}
              onClick={(e) => {
                e.stopPropagation()
                removeTask && removeTask()
              }}
              title={t('common:DELETE')}
            >
              <Icon.Close
                width="20"
                height="20"
                className="fill-black dark:fill-white"
              />
            </div>
          </div>
        )}
      </div>
      {linkEditable && (
        <div className="ml-7 flex gap-2">
          <div className="flex h-5 w-5 items-center justify-center">
            <Icon.Link
              width="20"
              height="20"
              className="fill-emerald-600"
            />
          </div>
          <div className={clsx('grow', !editable && 'truncate')}>
            <div
              onClick={(e) => {
                if (!task.linkUrl || editable) {
                  return
                }
                e.stopPropagation()
                openWindow(task.linkUrl)
              }}
              className={clsx(
                styles.textarea,
                editable
                  ? 'cursor-text break-words break-all placeholder:text-xs placeholder:text-gray-500 empty:before:text-gray-500 empty:before:content-[attr(placeholder)] dark:text-noteSecondTextDark dark:placeholder-gray-400'
                  : 'w-full cursor-pointer hover:text-emerald-600 hover:underline active:text-emerald-300 dark:hover:text-emerald-600 dark:active:text-emerald-300',
                'select-text text-xs font-normal leading-5 tracking-wide outline-none dark:text-noteSecondTextDark'
              )}
              placeholder={editable ? t('note:TASK.PLACEHOLDER.LINK') : undefined}
              contentEditable={editable}
              onInput={(e) => {
                e.stopPropagation()
                changeLinkUrl && changeLinkUrl(e.currentTarget.textContent)
              }}
              dangerouslySetInnerHTML={{ __html: task.linkUrl ?? '' }}
            />
          </div>
          <div className="flex shrink-0 gap-0.5">
            <div
              className={clsx(
                'flex h-5 w-5 cursor-pointer select-none items-center justify-center rounded-full p-0.5 transition-[visibility,opacity,background-color,transform] hover:bg-gray-200 active:bg-gray-100 dark:hover:bg-gray-500 dark:active:bg-gray-600',
                showButton ? 'visible scale-100 opacity-100' : 'invisible scale-0 opacity-0'
              )}
              onClick={(e) => {
                e.stopPropagation()
                copyLinkUrl && copyLinkUrl()
              }}
              title={t('common:COPY')}
            >
              <Icon.Copy
                width="13"
                height="13"
                className="fill-black dark:fill-white"
              />
            </div>
            <div
              className={clsx(
                'flex h-5 w-5 cursor-pointer select-none items-center justify-center rounded-full p-0.5 transition-[visibility,opacity,background-color,transform] hover:bg-gray-200 active:bg-gray-100 dark:hover:bg-gray-500 dark:active:bg-gray-600',
                showButton ? 'visible scale-100 opacity-100' : 'invisible scale-0 opacity-0'
              )}
              onClick={(e) => {
                e.stopPropagation()
                task.linkUrl && openWindow(task.linkUrl)
              }}
              title={t('common:OPEN.LINK')}
            >
              <Icon.OpenLink
                width="14"
                height="14"
                className="fill-black dark:fill-white"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
