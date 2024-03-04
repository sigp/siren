import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import addClassString from '../../../utilities/addClassString'
import getAvgEffectivenessStatus from '../../../utilities/getAvgEffectivenessStatus'
import toFixedIfNecessary from '../../../utilities/toFixedIfNecessary'
import Status from '../Status/Status'
import Typography from '../Typography/Typography'

export interface EffectivenessBreakdownProps {
  target?: number
  head?: number
  targetDescription: string
  headDescription: string
  className?: string
}

const EffectivenessBreakdown: FC<EffectivenessBreakdownProps> = ({
  target,
  head,
  targetDescription,
  headDescription,
  className,
}) => {
  const { t } = useTranslation()
  const targetStatus = getAvgEffectivenessStatus(target)
  const hitStatus = getAvgEffectivenessStatus(head)

  const classes = addClassString(
    'hidden w-52 absolute animate-fadeSlideIn left-0 z-50 shadow-xl bg-white dark:bg-black',
    [className],
  )

  return (
    <div className={classes}>
      <div className='flex justify-between items-center p-2 pr-3 lg:justify-start lg:space-x-4'>
        <Status size='h-6 w-6' status={targetStatus} />
        <div>
          <Typography isBold type='text-caption1'>
            {target ? `${toFixedIfNecessary(target, 2)} %` : '----'}
          </Typography>
          <div className='mt-2'>
            <Typography isUpperCase isBold type='text-caption2'>
              {t('validatorManagement.effectiveness.targetVote')}
            </Typography>
            <Typography isBold type='text-caption2'>
              {targetDescription}
            </Typography>
          </div>
        </div>
      </div>
      <div className='flex justify-between items-center p-2 pr-3 mb-1 border-t-style100 lg:justify-start lg:space-x-4'>
        <Status size='h-6 w-6' status={hitStatus} />
        <div>
          <Typography isBold type='text-caption1'>
            {head ? `${toFixedIfNecessary(head, 2)} %` : '----'}
          </Typography>
          <div className='mt-2'>
            <Typography isUpperCase isBold type='text-caption2'>
              {t('validatorManagement.effectiveness.headVote')}
            </Typography>
            <Typography isBold type='text-caption2'>
              {headDescription}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EffectivenessBreakdown
