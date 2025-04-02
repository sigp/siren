import Link from 'next/link'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import formatEthAddress from '../../../../../../utilities/formatEthAddress'
import getEtherscanLink from '../../../../../../utilities/getEtherscanLink'
import isValidNetwork from '../../../../../../utilities/isValidNetwork'
import { BeaconNodeSpecResults } from '../../../../../types/beacon'
import Button, { ButtonFace } from '../../../../Button/Button'
import InfoBox, { InfoBoxType } from '../../../../InfoBox/InfoBox'
import Typography from '../../../../Typography/Typography'

export interface AcceptRisksProps {
  onAccept: () => void
  beaconSpec: BeaconNodeSpecResults
}

const AcceptRisks: FC<AcceptRisksProps> = ({ onAccept, beaconSpec }) => {
  const { t } = useTranslation()
  const { CONFIG_NAME, DEPOSIT_NETWORK_ID, DEPOSIT_CONTRACT_ADDRESS } = beaconSpec

  const etherScanLink = isValidNetwork(DEPOSIT_NETWORK_ID)
    ? getEtherscanLink(DEPOSIT_NETWORK_ID, `/address/${DEPOSIT_CONTRACT_ADDRESS}`)
    : null
  const networkInfoBlock = (
    <div className='w-full p-4 bg-white border border-primary rounded w-full flex items-center'>
      <div className='flex-1'>
        <Typography
          isUpperCase
          darkMode='text-dark900'
          isBold
          color='text-dark900'
          type='text-caption1'
        >
          {t('network')}: <span className='font-normal ml-2'>{CONFIG_NAME}</span>
        </Typography>
        <Typography
          isUpperCase
          darkMode='text-dark900'
          isBold
          color='text-dark900'
          type='text-caption1'
        >
          {t('networkId')}: <span className='font-normal ml-2'>{DEPOSIT_NETWORK_ID}</span>
        </Typography>
        <Typography
          isUpperCase
          darkMode='text-dark900'
          isBold
          color='text-dark900'
          type='text-caption1'
        >
          {t('address')}:{' '}
          <span className='font-normal ml-2 hidden md:block'>{DEPOSIT_CONTRACT_ADDRESS}</span>
          <span className='font-normal ml-2 md:hidden'>
            {formatEthAddress(DEPOSIT_CONTRACT_ADDRESS)}
          </span>
        </Typography>
      </div>
      <i className='bi-box-arrow-up-right text-primary' />
    </div>
  )

  return (
    <InfoBox type={InfoBoxType.NOTICE}>
      <div className='space-y-4 w-full'>
        <Typography type='text-subtitle2' darkMode='text-dark900' color='text-dark900'>
          {t('validatorManagement.acceptRiskInfo.title')}
        </Typography>
        <Typography type='text-caption1' darkMode='text-dark900' color='text-dark900'>
          {t('validatorManagement.acceptRiskInfo.text')}
        </Typography>
        <Typography type='text-caption1' darkMode='text-dark900' color='text-dark900'>
          {t('validatorManagement.acceptRiskInfo.pleaseReview')}
        </Typography>
        <div>
          {etherScanLink ? (
            <Link target='_blank' href={etherScanLink}>
              {networkInfoBlock}
            </Link>
          ) : (
            networkInfoBlock
          )}
        </div>
        <Button onClick={onAccept} type={ButtonFace.SECONDARY} className='w-full'>
          {t('understandAndAccept')}
        </Button>
      </div>
    </InfoBox>
  )
}

export default AcceptRisks
