import clsx from 'clsx'
import { FC, useMemo, memo } from 'react'
import { useTranslation } from 'react-i18next'
import formatEthAddress from '../../../../../../utilities/formatEthAddress'
import ValidatorLogo from '../../../../../assets/images/validators.svg'
import { ValidatorInfo } from '../../../../../types/validator'
import Tooltip from '../../../../ToolTip/Tooltip'
import Typography from '../../../../Typography/Typography'
import SelectedChip from './SelectedChip'

export interface SelectionDisplayProps {
  targetValidator: ValidatorInfo
  selectedSources: ValidatorInfo[]
  onRemoveSource: (pubKey: string) => void
  totalEffectiveBalance: number
  isOverMaxEb: boolean
}

const SelectionDisplay: FC<SelectionDisplayProps> = ({
  targetValidator,
  selectedSources,
  onRemoveSource,
  totalEffectiveBalance,
  isOverMaxEb,
}) => {
  const { t } = useTranslation()
  const { name, pubKey, index } = targetValidator
  const formattedPubKey = useMemo(() => formatEthAddress(pubKey, 7, 7), [pubKey])

  const tooltipStyle = useMemo(() => ({ fontSize: '11px' }), [])

  const renderedChips = useMemo(
    () =>
      selectedSources.map((source) => (
        <SelectedChip key={source.pubKey} onRemove={onRemoveSource} validator={source} />
      )),
    [selectedSources, onRemoveSource],
  )

  const containerStyles = clsx('w-full border', isOverMaxEb ? 'border-error' : 'border-r-style')

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
        <div className='w-full flex justify-between items-center'>
          <div className='flex sm:space-x-4'>
            <div className='hidden sm:block h-16 w-16 rounded-full bg-gradient-to-r from-primary to-tertiary' />
            <div className='space-y-1'>
              <Typography>{name}</Typography>
              <Tooltip
                place='top-start'
                style={tooltipStyle}
                id={`tool-display-${pubKey}`}
                text={pubKey}
              >
                <Typography type='text-caption' color='text-dark400' darkMode='dark:text-dark500'>
                  {formattedPubKey}
                </Typography>
              </Tooltip>
              <Typography type='text-caption' color='text-dark400' darkMode='dark:text-dark500'>
                {index}
              </Typography>
            </div>
          </div>
          <div className='space-y-2'>
            <Typography
              className='break-keep text-right'
              isBold
              type='text-subtitle1'
              color={isOverMaxEb ? 'text-error' : 'text-primary'}
              darkMode={isOverMaxEb ? 'dark:text-error' : 'dark:text-primary'}
            >
              {`${totalEffectiveBalance} ETH`}
            </Typography>
            {isOverMaxEb && (
              <Typography
                type='text-tiny'
                className='max-w-[150px] text-right'
                color='text-error'
                darkMode='dark:text-error'
              >
                {t('validatorManagement.consolidateView.overMaxEbErrorText')}
              </Typography>
            )}
          </div>
        </div>
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
