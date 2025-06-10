import { formatEther } from 'ethers'
import React from 'react'
import { Trans } from 'react-i18next'
import formatEthAddress from '../../../utilities/formatEthAddress'
import { Status } from '../../constants/enums'
import { ActivityType } from '../../types'
import Typography from '../Typography/Typography'

interface ActivityTextProps {
  type: ActivityType
  pubKey: string
  status: Status
  formattedData?: {
    amount?: string
    txHash?: string
    targetPubKey?: string
    sourcePubKey?: string
  }
}

const underline = <span className='underline font-bold' />

const ActivityText: React.FC<ActivityTextProps> = ({
  type,
  pubKey,
  status,
  formattedData = {},
}) => {
  const isError = status?.toUpperCase() === Status.ERROR

  const config = {
    [ActivityType.DEPOSIT]: {
      key: `deposit.${isError ? 'errorText' : 'text'}`,
      values: () => ({
        txHash: formatEthAddress(formattedData?.txHash),
        amount: formattedData?.amount ? Number(formatEther(formattedData.amount)) : '-',
      }),
    },
    [ActivityType.IMPORT]: {
      key: `validatorImport.${isError ? 'errorText' : 'text'}`,
      values: () => ({ pubKey: formatEthAddress(pubKey) }),
    },
    [ActivityType.GRAFFITI]: {
      key: `updateGraffiti.${isError ? 'errorText' : 'text'}`,
      values: () => ({ pubKey: formatEthAddress(pubKey) }),
    },
    [ActivityType.CONSOLIDATION]: {
      key: `consolidation.${isError ? 'error' : ''}${
        formattedData?.targetPubKey === formattedData?.sourcePubKey
          ? 'selfConsolidationText'
          : 'targetConsolidationText'
      }`,
      values: () => ({
        pubKey: formatEthAddress(formattedData?.targetPubKey),
        sourcePubKey: formatEthAddress(formattedData?.sourcePubKey),
      }),
    },
    [ActivityType.PARTIAL_WITHDRAWAL]: {
      key: `partialWithdrawal.${isError ? 'errorText' : 'text'}`,
      values: () => ({
        txHash: formatEthAddress(formattedData?.txHash),
        amount: formattedData?.amount,
        pubKey: formatEthAddress(pubKey),
      }),
    },
  }[type]

  if (!config) return null

  return (
    <Typography color='text-dark400' darkMode='dark:text-dark400' type='text-caption1'>
      <Trans
        i18nKey={`activityHistory.activities.${config.key}`}
        components={{ span: underline }}
        values={config.values()}
      />
    </Typography>
  )
}

export default ActivityText
