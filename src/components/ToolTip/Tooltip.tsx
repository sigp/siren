import React, { FC } from 'react'
import { Tooltip as TooltipComponent, PlacesType } from 'react-tooltip'
import addClassString from '../../../utilities/addClassString'
import { UiMode } from '../../constants/enums'
import useUiMode from '../../hooks/useUiMode'
import { OptionalString } from '../../types'

export interface TooltipProps {
  id: string
  text: string
  className?: OptionalString
  maxWidth?: number | undefined
  toolTipMode?: UiMode | undefined
  place?: PlacesType
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
        place={place as PlacesType}
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
