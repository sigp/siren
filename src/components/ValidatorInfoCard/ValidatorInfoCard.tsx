import Waves from '../../assets/images/waves.png'
import Typography from '../Typography/Typography'
import { FC } from 'react'
import { ValidatorInfo } from '../../types/validator'
import { useTranslation } from 'react-i18next'
import IdenticonIcon from '../IdenticonIcon/IdenticonIcon'
import addClassString from '../../utilities/addClassString'

export interface ValidatorInfoCardProps {
  validator: ValidatorInfo
  className?: string
  onClick?: () => void
}

const ValidatorInfoCard: FC<ValidatorInfoCardProps> = ({ validator, className, onClick }) => {
  const { t } = useTranslation()
  const { index, balance, pubKey, name } = validator
  const classes = addClassString(
    'w-full lg:w-80 h-60 lg:border-r-style100 px-8 lg:px-6 py-4 relative',
    [className],
  )

  return (
    <div onClick={onClick} className={classes}>
      <img
        alt='waves'
        src={Waves}
        className='z-10 w-full h-full absolute left-0 top-0 opacity-10'
      />
      <div className='w-full flex flex-col justify-between space-y-3 lg:space-y-0 h-full z-20 relative'>
        <div className='w-full flex justify-between'>
          <IdenticonIcon size={144} type='CIRCULAR' hash={pubKey} />
          <div className='text-right flex-1 flex flex-col justify-between'>
            <div>
              <Typography type='text-caption1' color='text-dark300'>
                {index}
              </Typography>
              <Typography>{name}</Typography>
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
