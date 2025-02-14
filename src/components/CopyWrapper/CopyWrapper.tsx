import React, { FC, ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'
import addClassString from '../../../utilities/addClassString'
import copyToClipboard from '../../../utilities/copyToClipboard'
import Tooltip, { TooltipProps } from '../ToolTip/Tooltip'

export interface CopyWrapperProps extends Omit<TooltipProps, 'children' | 'text'> {
  children: ReactNode
  isHoverCopy?: boolean
  copyText: string
  iconPlace?: 'left' | 'right' | undefined
}

const CopyWrapper: FC<CopyWrapperProps> = ({
  children,
  copyText,
  isHoverCopy,
  iconPlace = 'right',
  ...rest
}) => {
  const { t } = useTranslation()
  const [isCopied, setIsCopied] = useState<boolean>(false)

  const copyAddress = async () => {
    try {
      const isCopied = await copyToClipboard(copyText)

      if (isCopied) {
        setIsCopied(true)
        setTimeout(() => {
          setIsCopied(false)
        }, 2000)
      }
    } catch (e) {
      console.error(e)
    }
  }
  const isRightPosition = iconPlace === 'right'

  const contentClass = isRightPosition ? 'order-1 mr-2' : 'order-2 ml-2'
  const iconClass = addClassString(
    'bi bi-subtract group-hover:scale-90 text-caption1 text-dark400',
    [isRightPosition ? 'order-2' : 'order-1'],
  )

  return (
    <div className='group relative' onClick={copyAddress}>
      <Tooltip
        cursor='cursor-pointer'
        {...(!isHoverCopy && { isOpen: isCopied })}
        text={isHoverCopy && !isCopied ? copyText : t('copied')}
        style={{ fontSize: '12px', padding: '8px' }}
        {...rest}
      >
        <div className='flex items-center'>
          <div className={contentClass}>{children}</div>
          <i className={iconClass} />
        </div>
      </Tooltip>
    </div>
  )
}

export default CopyWrapper
