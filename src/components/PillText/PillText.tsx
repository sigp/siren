import clsx from 'clsx'
import { FC, useMemo } from 'react'
import Tooltip, { TooltipProps } from '../ToolTip/Tooltip'
import Typography, { TypographyColor } from '../Typography/Typography'

export interface PillTextProps extends Pick<TooltipProps, 'className'> {
  id: string
  isActive?: boolean
  toolTipText: string
  textPrefix: string
  displayText: string
  textColor?: TypographyColor | undefined
  textDarkMode?: string
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
}) => {
  const credentialPillClasses = clsx(
    'py-1 px-2 rounded flex items-center space-x-2',
    isActive ? 'bg-primary' : 'bg-dark100 dark:bg-dark700',
  )

  const toolTipStyle = useMemo(() => ({ fontSize: '11px' }), [])

  return (
    <Tooltip
      className={className}
      place='top-start'
      style={toolTipStyle}
      id={id}
      positionStrategy='fixed'
      text={toolTipText}
    >
      <div className={credentialPillClasses}>
        <Typography color={textColor} darkMode={textDarkMode} type='text-caption1.5'>
          {textPrefix}:
        </Typography>
        <Typography color={textColor} darkMode={textDarkMode} type='text-caption1.5'>
          {displayText}
        </Typography>
      </div>
    </Tooltip>
  )
}

export default PillText
