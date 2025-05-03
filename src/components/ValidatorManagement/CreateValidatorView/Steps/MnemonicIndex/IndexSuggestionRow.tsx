import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import formatEthAddress from '../../../../../../utilities/formatEthAddress'
import getBeaconChaLink from '../../../../../../utilities/getBeaconChaLink'
import isValidNetwork from '../../../../../../utilities/isValidNetwork'
import { IndexData } from '../../../../../types'
import ExternalLink from '../../../../ExternalLink/ExternalLink'
import PillText from '../../../../PillText/PillText'
import Typography from '../../../../Typography/Typography'

export interface IndexSuggestionRowProps {
  data: IndexData
  onClick: (index: number) => void
  networkId: number
}

const IndexSuggestionRow: FC<IndexSuggestionRowProps> = ({ data, onClick, networkId }) => {
  const { t } = useTranslation()
  const { index, pubKey, isActive } = data
  const selectSuggestion = () => onClick(index)

  const beaconChaLink = isValidNetwork(networkId)
    ? getBeaconChaLink(networkId, `/validator/${pubKey}`)
    : null

  return (
    <div
      onClick={selectSuggestion}
      className='py-3 px-4 hover:bg-dark900 cursor-pointer flex justify-between items-center'
    >
      <div className='flex space-x-4 items-center items-stretch'>
        <Typography type='text-caption1'>{index}</Typography>

        <div className='self-stretch w-px bg-gray-300' />

        <Typography type='text-caption1'>{formatEthAddress(pubKey)}</Typography>

        <div className='flex items-center'>
          <ExternalLink href={beaconChaLink} type='text-caption1.5' text={t('viewBeaconCha')} />
        </div>
      </div>
      {!isActive ? (
        <PillText isActive displayText={t('suggestedIndex')} />
      ) : (
        <PillText displayText={t('inUse')} />
      )}
    </div>
  )
}

export default IndexSuggestionRow
