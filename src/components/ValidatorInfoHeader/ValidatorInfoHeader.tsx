import IdenticonIcon from '../IdenticonIcon/IdenticonIcon'
import { ValidatorInfo } from '../../types/validator'
import { FC } from 'react'
import Typography from '../Typography/Typography'
import Waves from '../../assets/images/waves.png'
import { useRecoilValue } from 'recoil'
import { selectBeaconChaBaseUrl } from '../../recoil/selectors/selectBeaconChaBaseUrl'
import { useTranslation, Trans } from 'react-i18next'

export interface ValidatorInfoHeaderProps {
  validator: ValidatorInfo
}

const ValidatorInfoHeader: FC<ValidatorInfoHeaderProps> = ({ validator }) => {
  const { t } = useTranslation()
  const { pubKey, name, index, balance } = validator
  const baseUrl = useRecoilValue(selectBeaconChaBaseUrl)

  return (
    <div className='w-full relative'>
      <div className='absolute top-0 left-0 w-full h-full'>
        <div
          className='w-full h-full bg-no-repeat opacity-20 dark:opacity-10'
          style={{ backgroundImage: `url(${Waves})` }}
        />
        <div className='absolute top-0 right-0 w-3/4 h-full bg-gradient-to-l from-white dark:from-dark750 via-white dark:via-dark750 to-transparent' />
      </div>
      <div className='w-full flex relative p-6'>
        <div className='w-42 mr-2'>
          <IdenticonIcon size={144} type='CIRCULAR' hash={pubKey} />
        </div>
        <div className='flex-1 flex justify-between'>
          <div>
            <Typography className='text-left'>{name}</Typography>
            <a target='_blank' rel='noreferrer' href={`${baseUrl}/${index}`}>
              <Typography
                type='text-caption1'
                className='underline'
                color='text-primary'
                darkMode='dark:text-primary'
              >
                {t('validatorInfoHeader.viewOnBeaconChain')}
              </Typography>
            </a>
          </div>
          <div className='text-right flex flex-col justify-between'>
            <div>
              <Typography isBold type='text-caption1'>
                {pubKey.substring(0, 12)}
              </Typography>
              <Typography type='text-caption1'>{index}</Typography>
            </div>
            <div>
              <Typography>-</Typography>
              <Typography isUpperCase isBold type='text-tiny'>
                <Trans i18nKey='validatorInfoHeader.validatorBalance'>
                  <br />
                </Trans>
              </Typography>
              <Typography>{balance.toFixed(2)} ETH</Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ValidatorInfoHeader
