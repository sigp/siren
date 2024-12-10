import { motion } from 'framer-motion'
import Link from 'next/link'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import formatEthAddress from '../../../../../../utilities/formatEthAddress'
import getBeaconChaLink from '../../../../../../utilities/getBeaconChaLink'
import { NetworkId } from '../../../../../types'
import Button, { ButtonFace } from '../../../../Button/Button'
import Typography from '../../../../Typography/Typography'

export interface SuccessScreenProps {
  onClick?: () => void
  networkId: NetworkId
  validatorPubKey: string
}

const ValidatorSuccessScreen: FC<SuccessScreenProps> = ({
  onClick,
  networkId,
  validatorPubKey,
}) => {
  const { t } = useTranslation()
  const shortHandPubKey = formatEthAddress(validatorPubKey)
  const isValidNetwork = networkId === NetworkId.HOLESKY || networkId === NetworkId.MAINNET
  const beaconChaLink = isValidNetwork
    ? getBeaconChaLink(networkId, `/validator/${validatorPubKey}`)
    : `http://127.0.0.1:64498/validator/${validatorPubKey}`

  return (
    <div className='w-[500px] overflow-hidden bg-dark800 flex flex-col items-center justify-center rounded-md py-8 px-4 text-center space-y-8'>
      <motion.div
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.15, type: 'spring' }}
      >
        <i className='h-20 bi-check-circle text-success text-h1' />
      </motion.div>
      <div className='space-y-2 flex flex-col items-center'>
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Typography>{t('validatorManagement.signAndDeposit.successScreen.title')}</Typography>
        </motion.div>
        <motion.div
          className='w-fit'
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.25 }}
        >
          <Link href={beaconChaLink} target='_blank'>
            <div className='flex w-fit space-x-2 items-center'>
              <Typography color='text-dark400' type='text-caption1' className='underline'>
                {shortHandPubKey}
              </Typography>
              <i className='text-dark400 text-caption1 bi-box-arrow-up-right' />
            </div>
          </Link>
        </motion.div>
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Typography type='text-caption1'>
            {t('validatorManagement.signAndDeposit.successScreen.text')}
          </Typography>
        </motion.div>
      </div>
      <Button
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.2, delay: 0.35 }}
        onClick={onClick}
        className='mt-8'
        type={ButtonFace.SECONDARY}
      >
        {t('validatorManagement.manageValidators')}
      </Button>
    </div>
  )
}

export default ValidatorSuccessScreen
