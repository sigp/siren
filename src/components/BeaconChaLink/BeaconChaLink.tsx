import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useRecoilValue } from 'recoil'
import { selectBeaconChaBaseUrl } from '../../recoil/selectors/selectBeaconChaBaseUrl'
import Typography from '../Typography/Typography'

export interface BeaconChaLinkProps {
  index: number
}

const BeaconChaLink: FC<BeaconChaLinkProps> = ({ index }) => {
  const { t } = useTranslation()
  const baseUrl = useRecoilValue(selectBeaconChaBaseUrl)

  return (
    <a target='_blank' className='flex-1' rel='noreferrer' href={`${baseUrl}/${index}`}>
      <div className='cursor-pointer w-full h-full dark:bg-dark700 bg-dark25 flex-1 space-y-3 p-3'>
        <Typography type='text-caption1' isBold className='uppercase'>
          Beacon <br /> Cha.in
        </Typography>
        <Typography color='text-dark400' fontWeight='font-light' type='text-caption2'>
          {t('validatorManagement.details.exploreBeaconCha')}
        </Typography>
        <div className='w-full flex items-center space-x-8'>
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
