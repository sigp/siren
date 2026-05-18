import { FC } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import { useRecoilValue } from 'recoil'
import formatEthAddress from '../../../utilities/formatEthAddress'
import useLocalStorage from '../../hooks/useLocalStorage'
import { useNetworkProfile } from '../../hooks/useNetworkProfile'
import useValidatorName from '../../hooks/useValidatorName'
import { selectBeaconChaBaseUrl } from '../../recoil/selectors/selectBeaconChaBaseUrl'
import { ValAliases } from '../../types'
import { ValidatorInfo } from '../../types/validator'
import GradientHeader from '../GradientHeader/GradientHeader'
import IdenticonIcon from '../IdenticonIcon/IdenticonIcon'
import Tooltip from '../ToolTip/Tooltip'
import Typography from '../Typography/Typography'

export interface ValidatorInfoHeaderProps {
  validator: ValidatorInfo
  isAnimate?: boolean
  animName: string
}

const ValidatorInfoHeader: FC<ValidatorInfoHeaderProps> = ({ validator, isAnimate, animName }) => {
  const { t } = useTranslation()
  const { nativeSymbol } = useNetworkProfile()
  const { pubKey, index, balance } = validator
  const baseUrl = useRecoilValue(selectBeaconChaBaseUrl)
  const [aliases] = useLocalStorage<ValAliases>('val-aliases', {})
  const validatorName = useValidatorName(validator, aliases)

  const formattedPubKey = formatEthAddress(pubKey, 12, 4)

  return (
    <div className='w-full relative'>
      <div className='absolute overflow-hidden z-10 top-0 left-0 w-full h-full'>
        <GradientHeader speed={0.15} name={animName} className='h-full' isReady={isAnimate} />
      </div>
      <div className='w-full z-20 flex relative p-6'>
        <div className='w-42 mr-2'>
          <IdenticonIcon size={144} type='CIRCULAR' hash={pubKey} />
        </div>
        <div className='flex-1 flex justify-between'>
          <div>
            <Typography className='text-left'>{validatorName}</Typography>
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
              <Tooltip
                style={{ fontSize: '14px', fontStyle: 'font-openSauce' }}
                positionStrategy='fixed'
                place='top'
                delayHide={1500}
                id='val-pubKey'
                text={pubKey}
              >
                <Typography isBold type='text-caption1'>
                  {formattedPubKey}
                </Typography>
              </Tooltip>
              <Typography type='text-caption1'>{index}</Typography>
            </div>
            <div>
              <Typography>-</Typography>
              <Typography isUpperCase isBold type='text-tiny'>
                <Trans i18nKey='validatorInfoHeader.validatorBalance'>
                  <br />
                </Trans>
              </Typography>
              <Typography isBold color='text-primary' darkMode='dark:text-primary'>
                {balance.toFixed(2)} {nativeSymbol}
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ValidatorInfoHeader
