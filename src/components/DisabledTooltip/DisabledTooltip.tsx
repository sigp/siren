import Tooltip from '../ToolTip/Tooltip'
import { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { PlacesType } from 'react-tooltip'

export interface DisabledTooltipProps {
  children: ReactNode
  className?: string
  place?: PlacesType
}

const DisabledTooltip: FC<DisabledTooltipProps> = ({ children, place, className }) => {
  const { t } = useTranslation()
  return (
    <Tooltip
      className={className}
      place={place as PlacesType}
      text={t('comingSoon')}
      id={Math.random().toString()}
    >
      <div className='opacity-20 pointer-events-none'>{children}</div>
    </Tooltip>
  )
}

export default DisabledTooltip
