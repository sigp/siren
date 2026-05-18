import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Typography from '../Typography/Typography'

export interface UnsupportedNetworkNoticeProps {
  action: string
  symbol: 'ETH' | 'GNO'
}

const UnsupportedNetworkNotice: FC<UnsupportedNetworkNoticeProps> = ({ action, symbol }) => {
  const { t } = useTranslation()
  return (
    <div className='w-full h-full flex items-center justify-center p-6'>
      <Typography type='text-subtitle1' fontWeight='font-light' className='text-center'>
        {t('unsupportedNetworkNotice', { action, symbol })}
      </Typography>
    </div>
  )
}

export default UnsupportedNetworkNotice
