import { FC } from 'react'
import formatBalanceColor from '../../../utilities/formatBalanceColor'
import useEpochAprEstimate from '../../hooks/useEpochAprEstimate'
import { ValidatorCache, ValidatorInfo } from '../../types/validator'
import { TypographyColor } from '../Typography/Typography'
import DesktopDetailView from './Views/DesktopDetailView'
import MobileDetailView from './Views/MobileDetailView'

export interface ValidatorDetailTableProps {
  validator: ValidatorInfo
  validatorCacheData: ValidatorCache
}

export interface TableProps {
  balance: number | undefined
  income: number
  incomeColor: TypographyColor | undefined
  withdrawalAddress: string | undefined
  estimatedApr: number | undefined
  aprColor: TypographyColor | undefined
}

export const ValidatorDetailTable: FC<ValidatorDetailTableProps> = ({
  validator,
  validatorCacheData,
}) => {
  const { balance, index, withdrawalAddress, rewards } = validator
  const incomeColor = formatBalanceColor(rewards)
  const { estimatedApr, textColor } = useEpochAprEstimate(validatorCacheData, [String(index)])
  return (
    <>
      <MobileDetailView
        balance={balance}
        income={rewards}
        incomeColor={incomeColor}
        withdrawalAddress={withdrawalAddress}
        estimatedApr={estimatedApr}
        aprColor={textColor}
      />
      <DesktopDetailView
        balance={balance}
        income={rewards}
        incomeColor={incomeColor}
        withdrawalAddress={withdrawalAddress}
        estimatedApr={estimatedApr}
        aprColor={textColor}
      />
    </>
  )
}

export default ValidatorDetailTable
