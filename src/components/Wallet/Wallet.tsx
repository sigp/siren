import { FC } from 'react'
import Typography from '../Typography/Typography'
import { ReactComponent as WalletDefault } from '../../assets/images/wallet.svg'
import { useTranslation } from 'react-i18next'

export interface WalletProps {
  borderStyle?: string
  className?: string
}

const Wallet: FC<WalletProps> = ({ className = '', borderStyle = 'border' }) => {
  const { t } = useTranslation()
  return (
    <div
      className={`${borderStyle} ${className} items-center justify-between w-52 h-14 py-2 px-4 cursor-pointer max-h-full border-borderLight dark:border-borderDark`}
    >
      <WalletDefault className='h-10 w-10 rounded-full' />
      <div>
        <Typography isBold type='text-tiny' family='font-roboto'>
          MAINNET
        </Typography>
        <Typography isBold type='text-caption1' color='text-dark500' family='font-roboto'>
          0xAddress
        </Typography>
        <div className='flex space-x-2'>
          <Typography isBold type='text-tiny' color='text-primary' family='font-roboto'>
            {t('connected')}
          </Typography>
          <Typography isBold type='text-tiny' color='text-dark300' family='font-roboto'>
            {t('disconnect')}
          </Typography>
        </div>
      </div>
      <i className='bi bi-chevron-down text-caption1 dark:text-dark300' />
    </div>
  )
}

export default Wallet
