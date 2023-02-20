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
  bgColor?: string
  textColor?: string
  place?: ITooltip['place']
  children?: React.ReactNode
}

const Tooltip: FC<TooltipProps> = ({
  id,
  text,
  children,
  className,
  bgColor,
  textColor,
  maxWidth,
  place,
}) => {
  const { mode } = useUiMode()

  const isDarkMode = mode === UiMode.DARK
  const classes = addClassString('cursor-help', [className])
  return (
    <div id={id} className={classes} data-tooltip-content={text}>
      {children}
      <TooltipComponent
        className='shadow-xl'
        place={place}
        style={{
          maxWidth,
          backgroundColor: bgColor || isDarkMode ? '#7C5FEB' : '#FFFFFF',
          color: textColor || isDarkMode ? 'white' : 'black',
        }}
        anchorId={id}
      />
    </div>
  )
}

export default Tooltip
