import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import formatEthAddress from '../../../../../../../../utilities/formatEthAddress'
import getBeaconChaLink from '../../../../../../../../utilities/getBeaconChaLink'
import { NetworkId, TxHash } from '../../../../../../../types'
import ExternalLink from '../../../../../../ExternalLink/ExternalLink'
import TransactionStatus from '../../../../../../TransactionStatus/TransactionStatus'
import Typography from '../../../../../../Typography/Typography'

export interface ImportValidatorStepProps {
  networkId: NetworkId
  pubKey: string
  txHash: TxHash | undefined
  isImportError: boolean
}

const ImportValidatorStep: FC<ImportValidatorStepProps> = ({
  networkId,
  pubKey,
  txHash,
  isImportError,
}) => {
  const { t } = useTranslation()
  const shortHandPubKey = formatEthAddress(pubKey)
  const beaconChaLink = getBeaconChaLink(networkId, `/validator/${pubKey}`)

  return txHash ? (
    <div className='py-4'>
      <TransactionStatus
        networkId={networkId}
        title={t(
          `validatorManagement.txStatuses.${isImportError ? 'importError' : 'importPending'}.title`,
        )}
        text={!isImportError ? t('validatorManagement.txStatuses.importPending.text') : undefined}
        status={isImportError ? 'error' : 'pending'}
        txHash={txHash}
      >
        {isImportError && (
          <div className='space-y-2'>
            <Typography type='text-caption1'>
              {t('validatorManagement.txStatuses.importError.text', { pubKey: shortHandPubKey })}
            </Typography>
            <ExternalLink
              href={beaconChaLink}
              text={t('validatorManagement.reviewStatus', { pubKey: shortHandPubKey })}
            />
          </div>
        )}
      </TransactionStatus>
    </div>
  ) : null
}

export default ImportValidatorStep
