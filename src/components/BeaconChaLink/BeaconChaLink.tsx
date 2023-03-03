import { BeaconChaValidatorUrl, GoerliBeaconChaValidatorUrl } from '../../constants/constants'
import Typography from '../Typography/Typography'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useRecoilValue } from 'recoil'
import { selectBnChain } from '../../recoil/selectors/selectBnChain'
import { Network } from '../../constants/enums'

export interface BeaconChaLinkProps {
  index: number
}

const BeaconChaLink: FC<BeaconChaLinkProps> = ({ index }) => {
  const { t } = useTranslation()
  const bnNetwork = useRecoilValue(selectBnChain)

  const baseUrl =
    bnNetwork === Network.Mainnet ? BeaconChaValidatorUrl : GoerliBeaconChaValidatorUrl

  return (
    <a target='_blank' rel='noreferrer' href={`${baseUrl}/${index}`}>
      <div className='cursor-pointer dark:bg-dark700 bg-dark25 flex-1 space-y-3 p-3'>
        <Typography type='text-caption1' isBold className='uppercase'>
          Beacon <br /> Cha.in
        </Typography>
        <Typography color='text-dark400' fontWeight='font-light' type='text-caption2'>
          {t('validatorManagement.details.exploreBeaconChai')}
        </Typography>
        <div className='w-full flex items-center justify-between'>
          <Typography fontWeight='font-light' className='uppercase'>
            {t('validatorManagement.details.explore')}
          </Typography>
          <i className='bi-arrow-up-right text-primary' />
        </div>
      </div>
    </a>
  )
}

export default BeaconChaLink
