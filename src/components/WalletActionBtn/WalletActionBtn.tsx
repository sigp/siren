import { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useRecoilState } from 'recoil'
import useWalletConnection from '../../hooks/useWalletConnection'
import { isWalletConnectModal } from '../../recoil/atoms'
import Button, { ButtonFace } from '../Button/Button'
import Typography, { TypographyType } from '../Typography/Typography'

export interface WalletActionBtnProps {
  children: ReactNode
  textSize?: TypographyType | undefined
  isSufficientBalance?: boolean
}

const WalletActionBtn: FC<WalletActionBtnProps> = ({
  children,
  textSize,
  isSufficientBalance = true,
}) => {
  const { t } = useTranslation()
  const { isConnected, isValidNetwork, switchNetwork } = useWalletConnection()
  const [isOpen, setIsOpen] = useRecoilState(isWalletConnectModal)
  const openModal = () => setIsOpen(true)

  const renderButton = () => {
    switch (true) {
      case !isConnected:
        return (
          <Button
            className='w-full h-full'
            isLoading={isOpen}
            onClick={openModal}
            type={ButtonFace.SECONDARY}
          >
            <Typography color='text-white' type={textSize} darkMode='dark:text-white'>
              {t('connect')}
            </Typography>
          </Button>
        )
      case !isValidNetwork:
        return (
          <Button className='w-full h-full' onClick={switchNetwork} type={ButtonFace.ERROR}>
            <Typography
              color='text-error'
              type={textSize}
              darkMode='dark:text-error'
              className='break-keep whitespace-nowrap'
            >
              {t('switchNetwork')}
            </Typography>
          </Button>
        )
      case !isSufficientBalance:
        return (
          <Button className='w-full h-full' isDisabled type={ButtonFace.ERROR}>
            <Typography
              color='text-error'
              type={textSize}
              darkMode='dark:text-error'
              className='break-keep whitespace-nowrap'
            >
              {t('insufficientFunds')}
            </Typography>
          </Button>
        )
      default:
        return children
    }
  }

  return renderButton()
}

export default WalletActionBtn
