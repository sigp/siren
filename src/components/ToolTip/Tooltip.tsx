import React, { FC } from 'react'
import { Tooltip as TooltipComponent, ITooltip } from 'react-tooltip'
import useUiMode from '../../hooks/useUiMode'
import { UiMode } from '../../constants/enums'

export interface TooltipProps {
  id: string
  text: string
  className?: string
  maxWidth?: number
  place?: ITooltip['place']
  children?: React.ReactNode
}

const Tooltip: FC<TooltipProps> = ({ id, text, children, className, maxWidth, place }) => {
  const { mode } = useUiMode()

  const isDarkMode = mode === UiMode.DARK
  return (
    <div id={id} className={className} data-tooltip-content={text}>
      {children}
      <TooltipComponent
        place={place}
        style={{
          maxWidth,
          backgroundColor: isDarkMode ? '#1E1E1E' : '#F5F5F5',
          color: isDarkMode ? 'white' : 'black',
        }}
        anchorId={id}
      />
    </div>
  )
}

export default Tooltip
