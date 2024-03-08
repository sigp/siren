import { FC } from 'react'
import { UiMode } from '../../constants/enums'
import Tooltip from '../ToolTip/Tooltip'
import Typography from '../Typography/Typography'

export interface TabOptionProps {
  toolTipId?: string
  toolTip?: string
  isActive?: boolean
  toolTipMode?: UiMode
  text: string
  onClick?: () => void
}

const TabOption: FC<TabOptionProps> = ({
  text,
  toolTip,
  toolTipId,
  isActive,
  toolTipMode,
  onClick,
}) => {
  return (
    <div onClick={onClick} className='space-y-3 cursor-pointer group'>
      <div className='flex items-center space-x-2'>
        <Typography
          family='font-archivo'
          color={isActive ? 'text-white' : 'text-dark200'}
          type='text-caption2'
          isUpperCase
          className='md:text-caption1 group-hover:text-white'
        >
          {text}
        </Typography>
        {toolTip && toolTipId && (
          <Tooltip maxWidth={250} toolTipMode={toolTipMode} id={toolTipId} text={toolTip}>
            <i className='bi-question-circle-fill text-caption2 md:text-caption1 text-white' />
          </Tooltip>
        )}
      </div>
      {isActive && <hr className='bg-white w-full h-0.5' />}
    </div>
  )
}

export default TabOption
