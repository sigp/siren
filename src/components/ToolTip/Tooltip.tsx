import clsx from 'clsx'
import React, { FC, useMemo } from 'react'
import { Tooltip as RTTooltip } from 'react-tooltip'
import { UiMode } from '../../constants/enums'
import useUiMode from '../../hooks/useUiMode'
import { OptionalString } from '../../types'

export interface TooltipProps extends React.ComponentProps<typeof RTTooltip> {
  id: string
  text: string
  className?: OptionalString
  maxWidth?: number
  toolTipMode?: UiMode
  children?: React.ReactNode
  tooltipClassName?: OptionalString
  cursor?: string
}

const Tooltip: FC<TooltipProps> = ({
  id,
  text,
  children,
  className,
  maxWidth,
  toolTipMode,
  place = 'top',
  cursor = 'cursor-help',
  tooltipClassName,
  style,
  ...rest
}) => {
  const { mode } = useUiMode()
  const isDark = (toolTipMode || mode) === UiMode.DARK

  const containerClasses = clsx(className, cursor, 'w-fit')
  const toolTipClasses = clsx('shadow-xl z-50', tooltipClassName)

  const toolTipStyles = useMemo(
    () => ({
      maxWidth,
      backgroundColor: isDark ? '#7C5FEB' : '#FFF',
      color: isDark ? 'white' : 'black',
      ...style,
    }),
    [maxWidth, isDark, style],
  )

  return (
    <div data-tooltip-id={id} className={containerClasses} data-tooltip-content={text}>
      {children}
      <RTTooltip id={id} place={place} className={toolTipClasses} style={toolTipStyles} {...rest} />
    </div>
  )
}

export default Tooltip
