import { ProposerDuty, StatusColor } from '../../types'
import { FC, useState } from 'react'
import StatusBar from '../StatusBar/StatusBar'
import Typography from '../Typography/Typography'
import ProposalAlert from './ProposalAlert'
import getSlotTimeData from '../../utilities/getSlotTimeData'
import { useTranslation } from 'react-i18next'

export interface AlertGroupProps {
  duties: ProposerDuty[]
  onClick: (ids: string[]) => void
  genesis: number
  secondsPerSlot: number
}

const AlertGroup: FC<AlertGroupProps> = ({ duties, genesis, secondsPerSlot, onClick }) => {
  const { t } = useTranslation()
  const indices = duties.map(({ validator_index }) => validator_index)
  const uuids = duties.map(({ uuid }) => uuid)
  const isFullGroup = duties.length > 1
  const [isExpand, toggleGroup] = useState(false)

  const sortedDutiesBySlot = [...duties].sort((a, b) => Number(b.slot) - Number(a.slot))
  const latestDuty = sortedDutiesBySlot[0]
  const latestDutyTime = getSlotTimeData(Number(latestDuty.slot), genesis, secondsPerSlot)

  const toggle = () => toggleGroup(!isExpand)
  const removeGroup = () => onClick(uuids)

  const renderMappedDuties = () =>
    duties?.map((duty, index) => {
      const { isFuture, shortHand } = getSlotTimeData(Number(duty.slot), genesis, secondsPerSlot)

      return (
        <ProposalAlert
          onDelete={!isFullGroup ? removeGroup : undefined}
          isFuture={isFuture}
          key={index}
          duty={duty}
          time={shortHand}
        />
      )
    })

  return (
    <>
      {isFullGroup ? (
        <>
          <div className='w-full @1540:h-22 group border-b-style500 flex justify-between items-center space-x-2 @1540:space-x-4 p-2'>
            <StatusBar count={3} status={StatusColor.SUCCESS} />
            <div onClick={toggle} className='cursor-pointer w-full max-w-tiny @1540:max-w-full'>
              <Typography type='text-caption2'>
                {t(
                  `alertMessages.groupedProposers.${latestDutyTime.isFuture ? 'future' : 'past'}`,
                  { count: duties?.length, indices: indices.join(', ') },
                )}
              </Typography>
              <Typography color='text-primary' darkMode='text-primary' type='text-caption2'>
                {isExpand ? t('collapseInfo') : t('expandInfo')}
              </Typography>
            </div>
            <i
              onClick={removeGroup}
              className='bi-trash-fill cursor-pointer opacity-0 group-hover:opacity-100 text-dark200 dark:text-dark300'
            />
          </div>
          {isExpand && renderMappedDuties()}
        </>
      ) : (
        renderMappedDuties()
      )}
    </>
  )
}

export default AlertGroup
