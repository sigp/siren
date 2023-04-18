import React, { FC } from 'react'
import { Tooltip as TooltipComponent, ITooltip } from 'react-tooltip'
import useUiMode from '../../hooks/useUiMode'
import { UiMode } from '../../constants/enums'
import addClassString from '../../utilities/addClassString'

export interface TooltipProps {
  id: string
  text: string
  className?: string
  maxWidth?: number
  toolTipMode?: UiMode
  place?: ITooltip['place']
  children?: React.ReactNode
}

const Tooltip: FC<TooltipProps> = ({
  id,
  text,
  children,
  className,
  maxWidth,
  toolTipMode,
  place,
}) => {
  const { mode } = useUiMode()

  const scheme = toolTipMode || mode

  const isDarkMode = scheme === UiMode.DARK

  const classes = addClassString('cursor-help', [className])
  return (
    <div id={id} className={classes} data-tooltip-content={text}>
      {children}
      <TooltipComponent
        className='shadow-xl z-50'
        place={place}
        style={{
          maxWidth,
          backgroundColor: isDarkMode ? '#7C5FEB' : '#FFFFFF',
          color: isDarkMode ? 'white' : 'black',
        }}
        anchorId={id}
      />
    </div>
  )
}

export default Tooltip
