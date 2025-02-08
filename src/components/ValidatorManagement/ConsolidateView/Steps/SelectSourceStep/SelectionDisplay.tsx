import { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import formatEthAddress from '../../../../../../utilities/formatEthAddress'
import { ValidatorInfo } from '../../../../../types/validator'
import Typography from '../../../../Typography/Typography'
import SelectedChip from './SelectedChip'

export interface SelectionDisplayProps {
  targetValidator: ValidatorInfo
  selectedSources: ValidatorInfo[]
  onRemoveSource: (pubKey: string) => void
}

const SelectionDisplay: FC<SelectionDisplayProps> = ({
  targetValidator,
  selectedSources,
  onRemoveSource,
}) => {
  const { t } = useTranslation()
  const { name, pubKey, index, balance } = targetValidator
  const formattedPubKey = formatEthAddress(pubKey, 7, 7)

  const accumulatedSourceBalance = useMemo(() => {
    return selectedSources.reduce((acc, { balance }) => acc + balance, 0)
  }, [selectedSources])

  const totalBalance = Math.round(balance + accumulatedSourceBalance)

  return (
    <div className='w-full border-style'>
      <div className='w-full border-b-style p-2'>
        <Typography>{t('primaryValidator')}</Typography>
      </div>
      <div className='p-6'>
        <div className='w-full flex justify-between items-center'>
          <div className='flex space-x-4'>
            <div className='h-16 w-16 rounded-full bg-gradient-to-r from-primary to-tertiary' />
            <div className='space-y-1'>
              <Typography>{name}</Typography>
              <Typography type='text-caption'>{formattedPubKey}</Typography>
              <Typography type='text-caption'>{index}</Typography>
            </div>
          </div>
          <Typography
            className='break-keep'
            isBold
            type='text-subtitle1'
            color='text-primary'
            darkMode='text-primary'
          >
            {`${totalBalance} ETH`}
          </Typography>
        </div>
        {selectedSources.length > 0 && (
          <div className='py-4 flex flex-wrap border-t-style mt-6'>
            {selectedSources.map((source) => (
              <SelectedChip key={source.pubKey} onRemove={onRemoveSource} validator={source} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SelectionDisplay
