import { FC, ReactNode, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useRecoilState } from 'recoil'
import useWalletConnection from '../../hooks/useWalletConnection'
import { isWalletConnectModal } from '../../recoil/atoms'
import { Address } from '../../types'
import Button, { ButtonFace } from '../Button/Button'
import Typography, { TypographyType } from '../Typography/Typography'

export interface WalletActionGuardProps {
  children: ReactNode
  textSize?: TypographyType | undefined
  isSufficientBalance?: boolean
  targetAddress?: Address
  guardActionClass?: string
}

const WalletActionGuard: FC<WalletActionGuardProps> = ({
  children,
  textSize,
  isSufficientBalance = true,
  targetAddress,
  guardActionClass,
}) => {
  const { t } = useTranslation()
  const { isConnected, isValidNetwork, switchNetwork, address } = useWalletConnection()
  const [isWalletModalOpen, setIsOpen] = useRecoilState(isWalletConnectModal)
  const openModal = () => setIsOpen(true)

  const renderStatusButton = useCallback(
    (translationKey: string, buttonType: ButtonFace, onClick?: () => void, isDisabled = false) => (
      <Button
        className={guardActionClass}
        onClick={onClick}
        isDisabled={isDisabled}
        isLoading={translationKey === 'connect' && isWalletModalOpen}
        type={buttonType}
      >
        <Typography
          color={buttonType === ButtonFace.ERROR ? 'text-error' : 'text-white'}
          type={textSize}
          darkMode={buttonType === ButtonFace.ERROR ? 'dark:text-error' : 'dark:text-white'}
          className='break-keep whitespace-nowrap'
        >
          {t(translationKey)}
        </Typography>
      </Button>
    ),
    [isWalletModalOpen, t, textSize],
  )

  if (!isConnected) {
    return renderStatusButton('connect', ButtonFace.SECONDARY, openModal)
  }

  if (!isValidNetwork) {
    return renderStatusButton('switchNetwork', ButtonFace.ERROR, switchNetwork)
  }

  if (!isSufficientBalance) {
    return renderStatusButton('insufficientFunds', ButtonFace.ERROR, undefined, true)
  }

  if (!!targetAddress && targetAddress !== address) {
    return renderStatusButton('incorrectWallet', ButtonFace.ERROR, undefined, true)
  }

  return <>{children}</>
}

export default WalletActionGuard
