import { useRouter } from 'next/navigation'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useSetRecoilState } from 'recoil'
import addClassString from '../../../utilities/addClassString'
import { ValidatorModalView } from '../../constants/enums'
import useLocalStorage from '../../hooks/useLocalStorage'
import useValidatorName from '../../hooks/useValidatorName'
import { activeValidatorId, isValidatorDetail } from '../../recoil/atoms'
import { ValAliases } from '../../types'
import { ValidatorInfo } from '../../types/validator'
import AnimatedHeader, { AnimatedHeaderProps } from '../AnimatedHeader/AnimatedHeader'
import IdenticonIcon from '../IdenticonIcon/IdenticonIcon'
import Typography from '../Typography/Typography'

export interface ValidatorInfoCardProps extends Omit<AnimatedHeaderProps, 'className' | 'name'> {
  validator: ValidatorInfo
  className?: string
}

const ValidatorInfoCard: FC<ValidatorInfoCardProps> = ({
  validator,
  className,
  isReady,
  animate,
}) => {
  const router = useRouter()
  const { t } = useTranslation()
  const { index, balance, pubKey } = validator
  const setActiveValidatorId = useSetRecoilState(activeValidatorId)
  const setValDetail = useSetRecoilState(isValidatorDetail)
  const [aliases] = useLocalStorage<ValAliases>('val-aliases', {})
  const classes = addClassString(
    'w-full cursor-pointer lg:w-80 h-60 lg:border-r-style100 px-8 lg:px-6 py-4 relative overflow-hidden',
    [className],
  )

  const validatorName = useValidatorName(validator, aliases)
  const valHrefBase = `/dashboard/validators?id=${index}`
  const detailHref = `${valHrefBase}&modal=${ValidatorModalView.DETAILS}`

  const viewDetail = () => {
    setActiveValidatorId(index)
    setValDetail(true)
    router.push(detailHref)
  }

  return (
    <div onClick={viewDetail} className={classes}>
      <AnimatedHeader
        name={`${pubKey}-validatorcard`}
        animate={animate}
        speed={0.2}
        isReady={isReady}
        className='z-10 w-full h-full absolute left-0 top-0'
      />
      <div className='w-full flex flex-col justify-between space-y-3 lg:space-y-0 h-full z-20 relative'>
        <div className='w-full flex justify-between'>
          <IdenticonIcon size={144} type='CIRCULAR' hash={pubKey} />
          <div className='text-right flex-1 flex flex-col justify-between'>
            <div>
              <Typography type='text-caption1' color='text-dark300'>
                {index}
              </Typography>
              <Typography>{validatorName}</Typography>
            </div>
            <div className='space-y-2'>
              <div>
                <Typography color='text-dark300'>—</Typography>
                <Typography type='text-caption2' color='text-dark300' isBold isUpperCase>
                  {t('validatorManagement.details.validatorBalance')}
                </Typography>
              </div>
              <Typography isBold>{balance?.toFixed(4)}</Typography>
            </div>
          </div>
        </div>
        <div className='w-full flex'>
          <div className='flex-1 space-y-2'>
            <Typography type='text-caption2' color='text-dark300' isUpperCase>
              Pubkey
            </Typography>
            <Typography type='text-caption1' isBold>{`${pubKey?.substring(0, 12)}...`}</Typography>
          </div>
          <div className='flex-1 space-y-2'>
            <Typography type='text-caption2' color='text-dark300' isUpperCase>
              {t('validatorManagement.details.index')}
            </Typography>
            <Typography type='text-caption1' isBold>
              {index}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ValidatorInfoCard
