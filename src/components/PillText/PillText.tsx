import clsx from 'clsx'
import { FC, useMemo } from 'react'
import Tooltip, { TooltipProps } from '../ToolTip/Tooltip'
import Typography, { TypographyColor } from '../Typography/Typography'

export interface PillTextProps extends Pick<TooltipProps, 'className'> {
  id?: string
  isActive?: boolean
  toolTipText?: string
  textPrefix?: string
  displayText: string
  textColor?: TypographyColor | undefined
  textDarkMode?: string
  containerClassName?: string
}

const PillText: FC<PillTextProps> = ({
  isActive,
  id,
  toolTipText,
  textPrefix,
  displayText,
  textColor,
  textDarkMode,
  className,
  containerClassName,
}) => {
  const credentialPillClasses = clsx(
    'py-1 px-2 rounded flex items-center space-x-2',
    isActive ? 'bg-primary' : 'bg-dark100 dark:bg-dark700',
    containerClassName,
  )

  const toolTipStyle = useMemo(() => ({ fontSize: '11px' }), [])

  const content = (
    <div className={credentialPillClasses}>
      {textPrefix && (
        <Typography color={textColor} darkMode={textDarkMode} type='text-caption1.5'>
          {textPrefix}:
        </Typography>
      )}
      <Typography color={textColor} darkMode={textDarkMode} type='text-caption1.5'>
        {displayText}
      </Typography>
    </div>
  )

  return toolTipText && id ? (
    <Tooltip
      className={className}
      place='top-start'
      style={toolTipStyle}
      id={id}
      positionStrategy='fixed'
      text={toolTipText}
    >
      {content}
    </Tooltip>
  ) : (
    content
  )
}

export default PillText
