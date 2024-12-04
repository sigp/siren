import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import addClassString from '../../../../../../utilities/addClassString'
import formatEthAddress from '../../../../../../utilities/formatEthAddress'
import getBeaconChaLink from '../../../../../../utilities/getBeaconChaLink'
import { NetworkId, ValidatorCandidate } from '../../../../../types'
import ExternalLink from '../../../../ExternalLink/ExternalLink'
import Typography from '../../../../Typography/Typography'
import ValidatorCandidateRow from '../../../../ValidatorCandidateRow/ValidatorCandidateRow'

export interface MnemonicIndexRowProps {
  candidate: ValidatorCandidate
  depositNetworkId: NetworkId
}

const MnemonicIndexRow: FC<MnemonicIndexRowProps> = ({ candidate, depositNetworkId }) => {
  const { t } = useTranslation()
  const { isValidIndex, index, pubKey } = candidate
  const isPending = !Boolean(pubKey)
  const validClasses = addClassString('p-2 border rounded', [
    isPending
      ? 'border-style'
      : isValidIndex
        ? 'border-success bg-success100'
        : 'border-error bg-error100',
  ])
  const containerClasses = addClassString('flex flex-1 items-center', [
    pubKey ? 'justify-between' : 'justify-end',
  ])

  return (
    <ValidatorCandidateRow index={index} data={candidate}>
      <div className={containerClasses}>
        {pubKey && (
          <ExternalLink
            text={formatEthAddress(pubKey)}
            href={getBeaconChaLink(depositNetworkId, `/validator/${pubKey}`)}
          />
        )}
        <div className='px-4'>
          <div className={validClasses}>
            <Typography
              color={isPending ? 'text-dark900' : isValidIndex ? 'text-success' : 'text-error'}
              isCapitalize
              darkMode={
                isPending
                  ? 'dark:text-dark400'
                  : isValidIndex
                    ? 'dark:text-success'
                    : 'dark:text-error'
              }
              className='whitespace-nowrap'
              type='text-caption1'
            >
              {isPending ? `${t('waiting')}...` : isValidIndex ? t('available') : t('inUse')}
            </Typography>
          </div>
        </div>
      </div>
    </ValidatorCandidateRow>
  )
}

export default MnemonicIndexRow
