import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import useHasSufficientBalance from '../../../../../../../hooks/useHasSufficientBalance'
import Button, { ButtonFace } from '../../../../../../Button/Button'
import InfoBox, { InfoBoxType } from '../../../../../../InfoBox/InfoBox'
import Typography from '../../../../../../Typography/Typography'
import WalletActionGuard from '../../../../../../WalletActionGuard/WalletActionGuard'

export interface DepositStepProps {
  isLoading: boolean
  onDeposit: () => void
  depositAmount: bigint
}

const DepositStep: FC<DepositStepProps> = ({ isLoading, onDeposit, depositAmount }) => {
  const { t } = useTranslation()

  const { isSufficient } = useHasSufficientBalance(depositAmount)

  return (
    <div className='py-4 space-y-2'>
      <InfoBox type={InfoBoxType.NOTICE}>
        <Typography darkMode='text-dark900' color='text-dark900' type='text-caption1'>
          {t('validatorManagement.signAndDeposit.depositText')}
        </Typography>
      </InfoBox>
      <WalletActionGuard isSufficientBalance={isSufficient}>
        <Button
          isLoading={isLoading}
          type={ButtonFace.SECONDARY}
          className='w-full'
          onClick={onDeposit}
        >
          {t('validatorManagement.makeDeposit')}
        </Button>
      </WalletActionGuard>
    </div>
  )
}

export default DepositStep
