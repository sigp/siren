import React, { FC } from 'react'
import { Tooltip as RTTooltip } from 'react-tooltip'
import addClassString from '../../../utilities/addClassString'
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

  return (
    <div
      data-tooltip-id={id}
      className={`${className} ${cursor}`}
      data-tooltip-content={text}
    >
      {children}
      <RTTooltip
        id={id}
        place={place}
        className={addClassString('shadow-xl z-50', [tooltipClassName])}
        style={{
          maxWidth,
          backgroundColor: isDark ? '#7C5FEB' : '#FFF',
          color: isDark ? 'white' : 'black',
          ...style,
        }}
        {...rest}
      />
    </div>
  )
}

export default Tooltip
