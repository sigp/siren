import Tooltip from '../ToolTip/Tooltip'
import { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ITooltip } from 'react-tooltip'

export interface DisabledTooltipProps {
  children: ReactNode
  className?: string
  place?: ITooltip['place']
}

const DisabledTooltip: FC<DisabledTooltipProps> = ({ children, place, className }) => {
  const { t } = useTranslation()
  return (
    <Tooltip
      className={className}
      place={place}
      text={t('comingSoon')}
      id={Math.random().toString()}
    >
      <div className='opacity-20 pointer-events-none'>{children}</div>
    </Tooltip>
  )
}

export default DisabledTooltip
