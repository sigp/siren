import clsx from 'clsx'
import { FC, useMemo, memo } from 'react'
import { useTranslation } from 'react-i18next'
import ValidatorLogo from '../../../../../assets/images/validators.svg'
import { ValidatorInfo } from '../../../../../types/validator'
import EffectiveBalanceDisplay from '../../../../EffectiveBalanceDisplay/EffectiveBalanceDisplay'
import Typography from '../../../../Typography/Typography'
import SelectedChip from './SelectedChip'

export interface SelectionDisplayProps {
  targetValidator: ValidatorInfo
  selectedSources: ValidatorInfo[]
  onRemoveSource: (pubKey: string) => void
  isOverMaxEb: boolean
}

const SelectionDisplay: FC<SelectionDisplayProps> = ({
  targetValidator,
  selectedSources,
  onRemoveSource,
  isOverMaxEb,
}) => {
  const { t } = useTranslation()

  const totalSelectedBalance = useMemo(
    () => selectedSources.reduce((acc, { balance }) => acc + balance, 0),
    [selectedSources],
  )
  const renderedChips = useMemo(
    () =>
      selectedSources.map((source) => (
        <SelectedChip key={source.pubKey} onRemove={onRemoveSource} validator={source} />
      )),
    [selectedSources, onRemoveSource],
  )

  const containerStyles = clsx('w-full border', isOverMaxEb ? 'border-error' : 'border-r-style')

  const formattedTargetValidator = useMemo(() => {
    return { ...targetValidator, balance: targetValidator.balance + totalSelectedBalance }
  }, [targetValidator, totalSelectedBalance])

  return (
    <div className={containerStyles}>
      <div className='w-full border-b-style p-2'>
        <div className='flex items-center space-x-2'>
          <div className='w-4 h-4'>
            <ValidatorLogo className='text-black dark:text-dark500' />
          </div>
          <Typography>{t('primaryValidator')}</Typography>
        </div>
      </div>
      <div className='p-6'>
        <EffectiveBalanceDisplay validator={formattedTargetValidator} />
        {selectedSources.length > 0 && (
          <div className='py-4 flex lg:max-h-[150px] overflow-scroll flex-wrap border-t-style mt-6'>
            {renderedChips}
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(SelectionDisplay)
