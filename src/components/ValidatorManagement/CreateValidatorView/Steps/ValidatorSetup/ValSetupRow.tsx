import { formatEther, parseEther, parseUnits } from 'ethers'
import { ChangeEvent, FC } from 'react'
import { useTranslation } from 'react-i18next'
import addClassString from '../../../../../../utilities/addClassString'
import { WalletPrefix } from '../../../../../constants/enums'
import useElectraStatus from '../../../../../hooks/useElectraStatus'
import { ValidatorCandidate } from '../../../../../types'
import IconButton, { IconButtonTypes } from '../../../../IconButton/IconButton'
import Input from '../../../../Input/Input'
import Toggle from '../../../../Toggle/Toggle'
import Typography from '../../../../Typography/Typography'
import ValidatorCandidateRow from '../../../../ValidatorCandidateRow/ValidatorCandidateRow'

export interface ValSetupRowProps {
  index: number
  candidate: ValidatorCandidate
  minActivationBalance: bigint
  onUpdateCandidate: (id: string, data: ValidatorCandidate) => void
  onRemoveCandidate: (id: string) => void
}

const ValSetupRow: FC<ValSetupRowProps> = ({
  index,
  candidate,
  onUpdateCandidate,
  minActivationBalance,
  onRemoveCandidate,
}) => {
  const { t } = useTranslation()
  const { id, withdrawalPrefix, effectiveBalance } = candidate
  const removeCandidate = () => onRemoveCandidate(id)
  const { isEnabled } = useElectraStatus()

  const isError = effectiveBalance < parseEther('32') || effectiveBalance > parseEther('2048')

  const containerClasses = addClassString('flex relative items-center justify-end flex-1 pl-4', [
    isEnabled && 'border-l-style',
  ])

  const convertBalance = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const ether = value ? parseEther(value) : 0n
    onUpdateCandidate(id, { ...candidate, effectiveBalance: ether })
  }

  const toggleWalletPrefix = (value: boolean) => {
    let effectiveBalance = candidate.effectiveBalance
    if (!value) {
      effectiveBalance = parseUnits(minActivationBalance.toString(), 'gwei')
    }
    onUpdateCandidate(id, {
      ...candidate,
      withdrawalPrefix: withdrawalPrefix === WalletPrefix.TWO ? WalletPrefix.ONE : WalletPrefix.TWO,
      effectiveBalance,
    })
  }

  return (
    <ValidatorCandidateRow index={index + 1} data={candidate} onUpdateCandidate={onUpdateCandidate}>
      <div className={containerClasses}>
        {isEnabled ? (
          <div className='flex items-center pr-4 justify-between flex-1'>
            <div className='flex space-x-2'>
              <Typography type='text-tiny'>{t('validatorManagement.enableElectra')}</Typography>
              <Toggle
                height={14}
                width={34}
                id={`${id}-0x02-toggle`}
                value={withdrawalPrefix === WalletPrefix.TWO}
                onChange={toggleWalletPrefix}
              />
            </div>
            <div className='flex space-x-2 items-center pr-4'>
              {isError && (
                <div className='max-w-[150px]'>
                  <Typography type='text-tiny' color='text-error' darkMode='text-error'>
                    {t('validatorManagement.effectiveBalanceError')}
                  </Typography>
                </div>
              )}
              <div>
                <Input
                  disabled={withdrawalPrefix !== WalletPrefix.TWO}
                  error={isError ? ' ' : undefined}
                  className='w-fit'
                  inputStyle='basic'
                  value={Number(formatEther(effectiveBalance))}
                  onChange={convertBalance}
                  min={32}
                  max={2048}
                  type='number'
                />
              </div>
            </div>
          </div>
        ) : (
          <div className='p-4 hidden lg:block'>
            <i className='bi-check-circle text-primary' />
          </div>
        )}
        <div className='cursor-pointer p-4 border-l-style'>
          <IconButton
            buttonType={IconButtonTypes.TERTIARY}
            onClick={removeCandidate}
            icon='bi-dash-circle'
          />
        </div>
      </div>
    </ValidatorCandidateRow>
  )
}

export default ValSetupRow
